import * as d3 from "d3";
import type { CourseLink } from "../data/types";

// Default constants (or pass them in if needed)
const DEFAULT_LINK_WIDTH = 1;

export function renderLinks(
  linkGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  links: CourseLink[],
  isUser: boolean,
  // inProgress: string[],
  // recommended: string[],
) {
  // const recommendedLinks = links
  //   .filter(
  //     (link) =>
  //       (inProgress.includes(link.source as string) ||
  //         recommended.includes(link.source as string)) &&
  //       recommended.includes(link.target as string),
  //   )
  //   .map((link) => link.id);
  // console.log(recommended, recommendedLinks);

  return linkGroup
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "var(--color-muted-foreground)")
    .attr("stroke-opacity", (d) => {
      return d.flag && isUser ? 0.5 : 1;
    })
    .attr("stroke-dasharray", (d) => {
      return d.flag && isUser ? "4,2" : null;
      // TODO: debug
      // const isRecommended = recommendedLinks.includes(d.id);
      // console.log(isRecommended);
    })
    .attr("stroke-width", (d) => d.width || DEFAULT_LINK_WIDTH)
    .attr("marker-end", (d) => (d.length != 1 ? "url(#arrow)" : null))
    .style("transition", "all 0.5s ease")
    .style("cursor", "pointer")
    .style("opacity", 1);
}
