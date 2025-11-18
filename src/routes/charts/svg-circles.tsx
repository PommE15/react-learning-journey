import * as d3 from "d3";
import type { CourseNode } from "../data/types";

const NODE_RADIUS = 5;
const NODE_STROKE_WIDTH = 5;

export function renderNodeCircles(
  nodeElements: d3.Selection<SVGGElement, CourseNode, SVGGElement, unknown>,
  isUser: boolean,
  completed: string[],
  inProgress: string[],
  paths: { color: string }[], // circle color
) {
  const circles = nodeElements
    .append("circle")
    .attr("r", (d) =>
      d.id.includes("p") ? NODE_RADIUS + d.size * 1.5 : NODE_RADIUS,
    )
    .attr("fill", (d) =>
      completed.includes(d.id) ? paths[d.path[0] - 1].color : "#eee",
    )
    .attr("stroke", (d) => paths[d.path[0] - 1].color)
    .attr("stroke-width", NODE_STROKE_WIDTH)
    .style("display", (d) => (d.hasChild ? "none" : "block"))
    .style("pointer-events", "none")
    .style("transition", "all 0.8s ease");

  // Animate stroke width between NODE_STROKE_WIDTH and NODE_STROKE_WIDTH * 2
  if (isUser) {
    circles
      .filter((d) => inProgress.includes(d.id))
      .transition()
      .duration(1000) // 1 second
      .attr("stroke-width", NODE_STROKE_WIDTH / 2)
      .transition()
      .duration(1000)
      .attr("stroke-width", NODE_STROKE_WIDTH * 3)
      .on("end", function repeat() {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("stroke-width", NODE_STROKE_WIDTH / 2)
          .transition()
          .duration(1000)
          .attr("stroke-width", NODE_STROKE_WIDTH * 3)
          .on("end", repeat);
      });
  }
}
