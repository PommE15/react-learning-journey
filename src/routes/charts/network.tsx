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
import { userCourses } from "../data/courses-network";
import { renderNodeCircles } from "./svg-circles";
import { renderNodeTexts } from "./svg-texts";
import { renderArrowMarker } from "./svg-marker-arrow";
import { renderLinks } from "./svg-lines";
import { generateRecommended } from "../data/users";
import { useForceSimulation } from "./force-layout";

// Graph dimensions and layout constants
const GRAPH_WIDTH = 1024;
const GRAPH_HEIGHT = 510;
const NODE_STROKE_WIDTH = 5;
const DEFAULT_LINK_WIDTH = 1;
const WIDTH_MULTIPLIER = 1.5;
const DIMMED_OPACITY = 0.2;
const DEFAULT_OPACITY = 1;

// Window resize and hover debounce
const RESIZE_THRESHOLD = 1;
const HOVER_ENTER_DELAY = 10;
const HOVER_LEAVE_DELAY = 100;

const { completed, inProgress } = userCourses;

const NetworkGraph = ({
  data,
  selectedCategories,
  isUser,
}: NetworkGraphProps) => {
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

    // Create debouncers with appropriate delays - MOVED UP before other functions that use it
    const hoverDebouncer = new InteractionDebouncer<CourseNode | CourseLink>(
      HOVER_ENTER_DELAY,
      HOVER_LEAVE_DELAY,
    );

    // Set up SVG dimensions and viewBox for proper scaling
    const svgSelection = d3
      .select(svg)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${width / 15} 0 ${width} ${height}`)
      .on("mouseleave", () => {
        hoverDebouncer.onLeave(() => {
          clearHighlight();
          applyCategoryHighlight();
        });
      });
    // Define arrow marker
    renderArrowMarker(svgSelection);

    // Create Voronoi selection manager
    const voronoiSelection = new VoronoiSelection(svgSelection, width, height);

    // Create container groups for links and nodes (for proper layering)
    const container = svgSelection.append("g");
    const linkGroup = container.append("g");
    const nodeGroup = container.append("g");

    // TODO: add recommended course

    // Create link elements (lines connecting nodes) - NO hover events
    const recommended = generateRecommended(completed, inProgress);
    const linkElements = renderLinks(
      linkGroup,
      links,
      isUser,
      /*inProgress,
      recommended,*/
    );

    // Create node elements (group containers for circles and text) - NO hover events
    const nodeElements = nodeGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g");

    // Add circles to nodes with dynamic sizing and group-based colors
    renderNodeCircles(nodeElements, isUser, completed, inProgress, paths);
    // Add labels to nodes positioned above the circles
    renderNodeTexts(nodeElements, isUser, completed, inProgress, recommended);

    // Clear highlight function - MOVED UP to be available for other functions
    const clearHighlight = (isDim: boolean = false) => {
      // Hide path's description text
      if (textElement) {
        textElement.classList.remove("opacity-100");
        textElement.classList.add("opacity-0");
      }

      // Reset all nodes and links to normal state
      nodeElements
        .style("opacity", isDim ? DIMMED_OPACITY / 2 : DEFAULT_OPACITY)
        .select("circle")
        .attr("stroke-width", NODE_STROKE_WIDTH);
      linkElements
        .style("opacity", isDim ? DIMMED_OPACITY : DEFAULT_OPACITY)
        .attr("stroke-width", (link) => link.width || DEFAULT_LINK_WIDTH);
    };

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

    // Initialize force simulation with extracted logic
    const cleanupSimulation = useForceSimulation(
      nodes,
      links,
      paths,
      dimensions,
      tick,
    );

    // Apply category highlighting after everything is set up
    applyCategoryHighlight();

    // Cleanup function to stop simulation when component unmounts or dimensions change
    return () => {
      cleanupSimulation();
      hoverDebouncer.cleanup();
    };
  }, [dimensions, data, selectedCategories, isUser]);

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
        className="p3 absolute z-10 opacity-0 transition-opacity duration-200 pointer-events-none"
      ></div>
      <svg ref={svgRef} className="w-full h-full bg-grid" />
    </div>
  );
};

export default NetworkGraph;
