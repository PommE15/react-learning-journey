import * as d3 from "d3";

export function renderCircleMarker(
  svgSelection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
) {
  svgSelection
    .append("marker")
    .attr("id", "dot") // New ID for your dot marker
    .attr("viewBox", "0 0 10 10") // Coordinate system for the marker
    .attr("refX", 5) // Position of the dot along the line
    .attr("refY", 5)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("circle") // Use a circle instead of a path
    .attr("cx", 5) // Center of the circle
    .attr("cy", 5)
    .attr("r", 3) // Radius of the dot
    .attr("fill", "var(--color-muted-foreground)");
}
