import * as d3 from "d3";
import type { CourseNode } from "../data/types";

// Constants (or pass them in if needed)
const TEXT_ROTATION = -30;
const TEXT_X_OFFSET = 5;
const TEXT_Y_OFFSET = 15;

export function renderNodeTexts(
  nodeElements: d3.Selection<SVGGElement, CourseNode, SVGGElement, unknown>,
  completed: string[],
  inProgress: string[],
  recommended: string[],
) {
  nodeElements
    .append("text")
    .attr("dx", (d) => (d.id.includes("c") ? TEXT_X_OFFSET : 0))
    .attr("dy", (d) =>
      d.id.includes("c") ? -TEXT_Y_OFFSET : TEXT_Y_OFFSET * 2 + d.size,
    )
    .attr("text-anchor", (d) => (d.id.includes("c") ? "" : "middle"))
    .attr("transform", (d) =>
      d.id.includes("c") ? `rotate(${TEXT_ROTATION})` : "rotate(0)",
    )
    .attr(
      "class",
      (d) => `svg-text
      ${d.id.includes("c") ? "text-xs" : ""}
      ${inProgress.includes(d.id) ? "font-bold" : ""}`,
    )
    .style("pointer-events", "none")
    .style("opacity", (d) => (d.hasChild ? "0.5" : "1"))
    .style("stroke", (d) =>
      recommended.includes(d.id) ? "#fffbeb" /*amber-50*/ : "white",
    )
    .style("stroke-opacity", (d) =>
      recommended.includes(d.id) ? "0.5" : "0.9",
    )
    .text((d) =>
      d.hasChild
        ? `( ${d.id.toUpperCase()}. ${d.title} )`
        : `${d.id.toUpperCase()}. ${d.title}` +
          `${completed.includes(d.id) ? " [O]" : ""} `,
    );
}
