import * as d3 from "d3";

export function renderArrowMarker(
  svgSelection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
) {
  svgSelection
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 15) // how far the arrow sits past the line end
    .attr("refY", 5)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", "var(--color-muted-foreground)");
}
