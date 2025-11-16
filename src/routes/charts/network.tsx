import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { InteractionDebouncer } from "../../utils/debouncer";
import { VoronoiSelection, type VoronoiElement } from "./voronoi";
import type {
  NetworkGraphProps,
  CourseNode,
  CourseLink,
  CourseCategory,
} from "../data/types";

// Graph dimensions and layout constants
const GRAPH_WIDTH = 1024;
const GRAPH_HEIGHT = 500;
const GROUPED_SPACING = 32;
const TEXT_ROTATION = -30;
const TEXT_Y_OFFSET = -10;
const NODE_RADIUS = 5;
const NODE_STROKE_WIDTH = 5;
const DEFAULT_LINK_LENGTH = 100;
const DEFAULT_LINK_WIDTH = 1;
const WIDTH_MULTIPLIER = 1.5;
const DIMMED_OPACITY = 0.2;
const DEFAULT_OPACITY = 1;

// Force layout transition
const COLLISION_RADIUS_OFFSET = 1;
const SIMULATION_VELOCITY_DECAY = 0.01;
const SIMULATION_RESTART_ALPHA = 0.001;
const ANIMATION_DELAY = 800;

// Window resize and hover debounce
const RESIZE_THRESHOLD = 1;
const HOVER_ENTER_DELAY = 10;
const HOVER_LEAVE_DELAY = 100;

const NetworkGraph = ({ data, selectedCategories }: NetworkGraphProps) => {
  // Refs for SVG element and container div
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousWidthRef = useRef<number>(GRAPH_WIDTH);

  // State to track container dimensions for responsive sizing
  const [dimensions, setDimensions] = useState({
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
  });

  // Handle container resize - updates dimensions when container size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Note that ResizeObserver is already throttled by the browser
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const roundedWidth = Math.round(width);

      if (
        Math.abs(roundedWidth - previousWidthRef.current) > RESIZE_THRESHOLD
      ) {
        previousWidthRef.current = roundedWidth;
        setDimensions({ width: roundedWidth, height: GRAPH_HEIGHT });
      }
    });
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Main effect to create and update the D3 network graph
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { nodes, links, paths } = data;
    const { width, height } = dimensions;

    // Clear any existing content from previous renders
    d3.select(svg).selectAll("*").remove();

    // Create path description element
    const textElement = document.getElementById("path-description");

    // Set up SVG dimensions and viewBox for proper scaling
    const svgSelection = d3
      .select(svg)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .on("mouseleave", () => {
        hoverDebouncer.onLeave(() => {
          clearHighlight();
          applyCategoryHighlight();
        });
      });

    // Create Voronoi selection manager
    const voronoiSelection = new VoronoiSelection(svgSelection, width, height);

    // Create container groups for links and nodes (for proper layering)
    const container = svgSelection.append("g");
    const linkGroup = container.append("g");
    const nodeGroup = container.append("g");

    // Create link elements (lines connecting nodes) - NO hover events
    const linkElements = linkGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "var(--color-muted-foreground)")
      .attr("stroke-width", (d) => d.width || DEFAULT_LINK_WIDTH)
      .style("transition", "all 0.5s ease")
      .style("cursor", "pointer");

    // Create node elements (group containers for circles and text) - NO hover events
    const nodeElements = nodeGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g");

    // Add circles to nodes with dynamic sizing and group-based colors
    nodeElements
      .append("circle")
      .attr("r", (d) => NODE_RADIUS + d.size)
      .attr("fill", "#eee")
      .attr("stroke", (d) => paths[d.path[0] - 1].color) // id is index+1
      .attr("stroke-width", NODE_STROKE_WIDTH)
      .style("pointer-events", "none")
      .style("transition", "all 0.8s ease");

    // Add labels to nodes positioned above the circles
    nodeElements
      .append("text")
      .attr("dy", (d) => TEXT_Y_OFFSET - d.size * 2)
      .attr("text-anchor", (d) => (d.id.includes("c") ? "" : "middle"))
      .attr("transform", (d) =>
        d.id.includes("c") ? `rotate(${TEXT_ROTATION})` : "rotate(0)",
      )
      .attr("class", "svg-text")
      .style("pointer-events", "none")
      .text((d) => d.title);

    // Create debouncers with appropriate delays
    const hoverDebouncer = new InteractionDebouncer<CourseNode | CourseLink>(
      HOVER_ENTER_DELAY,
      HOVER_LEAVE_DELAY,
    );

    // Hightlight path (separated from debouncing logic)
    const applyHighlightPath = (
      element: CourseNode | CourseLink | CourseCategory,
      type: string,
      // metadata?: Record<string, unknown>,
    ) => {
      const hoveredPath = element.path[0];

      if (type !== "path") clearHighlight(true);

      if (textElement) {
        // Update path description
        textElement.classList.remove("opacity-0");
        textElement.classList.add("opacity-100");
        textElement.textContent = `You are looking at the ${paths[hoveredPath - 1].title || "developer's"} developer's path.`; //id is index
      }

      // Highlight the specifically hovered node with thicker stroke
      // Dim nodes and paths that are not part of the hovered group
      nodeElements
        .filter((node) => node.path.includes(hoveredPath))
        .style("opacity", DEFAULT_OPACITY);

      nodeElements.select("circle").attr("stroke-width", (node) => {
        return type === "node" && node.id === (element as CourseNode).id
          ? NODE_STROKE_WIDTH * WIDTH_MULTIPLIER
          : NODE_STROKE_WIDTH;
      });

      // Thicken links that are part of the hovered group for better visibility
      // Dim paths that are not part of the hovered group
      linkElements
        .filter((link) => link.path.includes(hoveredPath))
        .style("opacity", DEFAULT_OPACITY)
        .attr("stroke-width", (link) =>
          link.path.includes(hoveredPath)
            ? (link.width || DEFAULT_LINK_WIDTH) * WIDTH_MULTIPLIER
            : link.width || DEFAULT_LINK_WIDTH,
        );
    };
    const clearHighlight = (isDim: boolean = false) => {
      // Hide path's description text
      if (textElement) {
        textElement.classList.remove("opacity-100");
        textElement.classList.add("opacity-0");
      }

      // Reset all nodes and links to normal state
      nodeElements
        .style("opacity", isDim ? DIMMED_OPACITY : DEFAULT_OPACITY)
        .select("circle")
        .attr("stroke-width", NODE_STROKE_WIDTH);
      linkElements
        .style("opacity", isDim ? DIMMED_OPACITY : DEFAULT_OPACITY)
        .attr("stroke-width", (link) => link.width || DEFAULT_LINK_WIDTH);
    };

    const applyCategoryHighlight = () => {
      // Reset graph to dim mode
      clearHighlight(true);

      // Highlight path
      const selectedPaths = paths.filter((course) =>
        selectedCategories.includes(course.categories[0]),
      );
      if (selectedPaths.length > 0) {
        selectedPaths.forEach((course) => {
          applyHighlightPath(course, "path");
        });
      } else {
        paths.forEach((course) => {
          applyHighlightPath(course, "path");
        });
      }
      if (textElement) textElement.textContent = "";
    };

    // Update the Voronoi handlers to include click
    // Debounced hover handlers for Voronoi
    const handleMouseEnter = (element: VoronoiElement, event?: MouseEvent) => {
      if (event?.type === "click") {
        // handleNodeClick(element.data as CourseNode | CourseLink);
        console.log("Clicked:", element.data);
      } else {
        hoverDebouncer.onEnter(
          element.data as CourseNode | CourseLink,
          element.type,
          applyHighlightPath,
        );
      }
    };

    const handleMouseLeave = () => {
      hoverDebouncer.onLeave(() => clearHighlight);
    };

    // Set initial positions at center for animation effect
    nodes.forEach((node) => {
      node.x = width / 2;
      node.y = height / 2;
      // Don't set fixed positions initially for animation
    });

    const simulation = d3
      .forceSimulation<CourseNode>(nodes)
      .velocityDecay(SIMULATION_VELOCITY_DECAY) // Higher decay (default: 0.4) - smoother, less bouncy movement
      .force(
        "link",
        d3
          .forceLink<CourseNode, CourseLink>(links)
          .id((d) => d.id)
          .distance((d) => d.length || DEFAULT_LINK_LENGTH),
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => COLLISION_RADIUS_OFFSET + (d as CourseNode).size),
      )
      .on("tick", tick);

    // After a delay, set fixed positions for animation effect
    setTimeout(() => {
      nodes.forEach((node) => {
        // Find nodes center
        const centerX = nodes.find((n) => n.id[1] === node.id[1])?.px || 1 / 2;
        console.log(
          node.id,
          nodes.find((n) => n.id[1] === node.id[1])?.px,
          centerX,
        );
        // Special handling for level course nodes - center them in a row
        if (node.id.includes("c")) {
          const group2Nodes = nodes.filter((n) => n.id.includes("c"));
          const nodeIndex = group2Nodes.findIndex((n) => n.id === node.id);
          const spacing = GROUPED_SPACING;
          const totalWidth = (group2Nodes.length - 1) * spacing;
          const startX = (width - totalWidth) * centerX;
          node.fx = startX + nodeIndex * spacing;
        }
        // If node has custom x position (px), fix it horizontally
        else if (node.px) {
          node.fx = node.px * width;
        }
        // All nodes are fixed vertically based on their group
        node.fy = paths[node.path[0] - 1].py * height; //id is index
      });

      // Restart with lower alpha for gentler transition
      simulation.alpha(SIMULATION_RESTART_ALPHA).restart();
    }, ANIMATION_DELAY);

    // Tick function called on each simulation step to update element positions
    function tick() {
      // Update link positions based on connected node positions
      linkElements
        .attr("x1", (d) => (d.source as CourseNode).x!)
        .attr("y1", (d) => (d.source as CourseNode).y!)
        .attr("x2", (d) => (d.target as CourseNode).x!)
        .attr("y2", (d) => (d.target as CourseNode).y!);

      // Update node positions using transform translate
      nodeElements.attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Update Voronoi selection with current positions
      voronoiSelection.clear();

      // Add nodes to Voronoi
      voronoiSelection.addNodes(
        nodes,
        (d) => d.x || 0,
        (d) => d.y || 0,
      );

      // Add links to Voronoi
      voronoiSelection.addLinks(
        links,
        (d) => (d.source as CourseNode).x || 0,
        (d) => (d.source as CourseNode).y || 0,
        (d) => (d.target as CourseNode).x || 0,
        (d) => (d.target as CourseNode).y || 0,
      );

      // Update Voronoi with event handlers
      voronoiSelection.update(handleMouseEnter, handleMouseLeave);
    }

    // Apply category highlighting after everything is set up
    applyCategoryHighlight();

    // Cleanup function to stop simulation when component unmounts or dimensions change
    return () => {
      simulation.stop();
      hoverDebouncer.cleanup();
    };
  }, [dimensions, data, selectedCategories]);

  // Render the container div and SVG element
  return (
    <div
      ref={containerRef}
      className="w-full relative"
      style={{ maxHeight: `${GRAPH_HEIGHT}px` }}
    >
      {/* Path description overlay */}
      <div
        id="path-description"
        className="p3 absolute z-10 opacity-0 transition-opacity duration-200"
      ></div>
      <svg ref={svgRef} className="w-full h-full bg-grid" />
    </div>
  );
};

export default NetworkGraph;
