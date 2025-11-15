import * as d3 from "d3";

export interface VoronoiElement {
  x: number;
  y: number;
  data: unknown;
  type: "node" | "link";
}

export class VoronoiSelection {
  private delaunay?: d3.Delaunay<VoronoiElement>;
  private voronoi?: d3.Voronoi<VoronoiElement>;
  private elements: VoronoiElement[] = [];
  private voronoiGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  private bounds: [number, number, number, number];

  constructor(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number,
  ) {
    this.bounds = [0, 0, width, height];

    // Create invisible Voronoi group (add first so it's behind everything)
    this.voronoiGroup = svg
      .insert("g", ":first-child")
      .attr("class", "voronoi-selection")
      .style("pointer-events", "all");
  }

  // Add nodes to Voronoi selection
  addNodes<T>(nodes: T[], getX: (d: T) => number, getY: (d: T) => number) {
    nodes.forEach((node) => {
      this.elements.push({
        x: getX(node),
        y: getY(node),
        data: node,
        type: "node",
      });
    });
  }

  // Add link midpoints to Voronoi selection
  addLinks<T>(
    links: T[],
    getSourceX: (d: T) => number,
    getSourceY: (d: T) => number,
    getTargetX: (d: T) => number,
    getTargetY: (d: T) => number,
  ) {
    links.forEach((link) => {
      const sourceX = getSourceX(link);
      const sourceY = getSourceY(link);
      const targetX = getTargetX(link);
      const targetY = getTargetY(link);

      // Add midpoint of the link
      this.elements.push({
        x: (sourceX + targetX) / 2,
        y: (sourceY + targetY) / 2,
        data: link,
        type: "link",
      });
    });
  }

  // Update Voronoi diagram and attach event handlers
  update(
    onMouseEnter: (element: VoronoiElement, event: MouseEvent) => void,
    onMouseLeave: (element: VoronoiElement, event: MouseEvent) => void,
  ) {
    if (this.elements.length === 0) return;

    // Create Delaunay triangulation
    this.delaunay = d3.Delaunay.from(
      this.elements,
      (d) => d.x,
      (d) => d.y,
    );

    // Create Voronoi diagram
    this.voronoi = this.delaunay.voronoi(this.bounds);

    // Get the polygons
    const polygons: Array<[number, number][] | null> = [];
    for (let i = 0; i < this.elements.length; i++) {
      const polygon = this.voronoi.cellPolygon(i);
      polygons.push(polygon);
    }

    // Update Voronoi cells
    const cells = this.voronoiGroup
      .selectAll<SVGPathElement, [number, number][] | null>("path")
      .data(polygons);

    cells.exit().remove();

    const cellsEnter = cells.enter().append("path");

    cells
      .merge(cellsEnter)
      .attr("d", (d) => {
        if (!d || d.length === 0) return null;
        return `M${d.map((point) => point.join(",")).join("L")}Z`;
      })
      .style("fill", "none")
      .style("stroke", "none")
      .style("pointer-events", "all")
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        const index = polygons.indexOf(d);
        if (index >= 0 && this.elements[index]) {
          onMouseEnter(this.elements[index], event as MouseEvent);
        }
      })
      .on("mouseleave", (event, d) => {
        const index = polygons.indexOf(d);
        if (index >= 0 && this.elements[index]) {
          onMouseLeave(this.elements[index], event as MouseEvent);
        }
      });

    // Debug mode - uncomment to see Voronoi cells
    // cells
    //   .merge(cellsEnter)
    //   .style("fill", "rgba(255, 0, 0, 0.1)")
    //   .style("stroke", "red")
    //   .style("stroke-width", 0.5);
  }

  // Clear all elements
  clear() {
    this.elements = [];
    this.voronoiGroup.selectAll("*").remove();
  }

  // Get element at mouse position (fallback method)
  getElementAt(mouseX: number, mouseY: number): VoronoiElement | null {
    let closest: VoronoiElement | null = null;
    let minDistance = Infinity;

    this.elements.forEach((element) => {
      const distance = Math.sqrt(
        Math.pow(element.x - mouseX, 2) + Math.pow(element.y - mouseY, 2),
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = element;
      }
    });

    return minDistance < 50 ? closest : null; // 50px threshold
  }
}
