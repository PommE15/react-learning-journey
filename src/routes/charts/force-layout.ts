import * as d3 from "d3";
import type { CourseCategory, CourseLink, CourseNode } from "../data/types";

// Constants for simulation
const GROUPED_SPACING = 32;
const COLLISION_RADIUS_OFFSET = 1;
const DEFAULT_LINK_LENGTH = 100;
const SIMULATION_VELOCITY_DECAY = 0.01;
const SIMULATION_RESTART_ALPHA = 0.001;
const ANIMATION_DELAY = 800;

// Type for the tick function to be passed back
type TickFunction = () => void;

/**
 * Manages the D3 force simulation for the network graph.
 * @param nodes - Array of CourseNode data.
 * @param links - Array of CourseLink data.
 * @param paths - Array of CourseCategory data for vertical fixing.
 * @param dimensions - Current { width, height } of the SVG container.
 * @param tick - Callback function to be executed on each simulation tick.
 * @returns A cleanup function to stop the simulation.
 */
export const useForceSimulation = (
  nodes: CourseNode[],
  links: CourseLink[],
  paths: CourseCategory[],
  dimensions: { width: number; height: number },
  tick: TickFunction,
) => {
  const { width, height } = dimensions;

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
  const timeoutId = setTimeout(() => {
    nodes.forEach((node) => {
      // Get nodes center
      const centerX = nodes.find((n) => n.id[1] === node.id[1])?.px || 1 / 2;

      // Special handling for level course nodes
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
      node.fy = paths[node.path[0] - 1].py * height; // id is index
    });

    // Restart with lower alpha for gentler transition
    simulation.alpha(SIMULATION_RESTART_ALPHA).restart();
  }, ANIMATION_DELAY);

  // Return a cleanup function
  return () => {
    clearTimeout(timeoutId);
    simulation.stop();
  };
};
