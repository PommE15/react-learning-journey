import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface SectionAccordionProps<T> {
  id: string; // accordion value
  title: string; // title before count
  items: T[]; // filtered list
  total: number; // original count
  hasActiveFilters: boolean; // show (... of X)
  render: (item: T) => React.ReactNode; // item renderer
}

export function SectionAccordion<T>({
  id,
  title,
  items,
  total,
  hasActiveFilters,
  render,
}: SectionAccordionProps<T>) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="-mb-4">
        <h2>
          {title} ({items.length}
          {hasActiveFilters && ` of ${total}`})
        </h2>
      </AccordionTrigger>

      <AccordionContent className="pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map(render)}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
