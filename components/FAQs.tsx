"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  title: string
  content: string
}

interface FAQsProps {
  items: FAQItem[]
}

const FAQs: React.FC<FAQsProps> = ({ items }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl lg:w-2/5 w-5/6 shadow-xl border border-gray-800 space-y-2">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {items.map((item, index) => (
          <AccordionItem
            key={item.title}
            value={`item-${index}`}
            className="rounded-xl border border-gray-800 overflow-hidden bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <AccordionTrigger className="px-5 py-4 text-base font-medium text-white hover:no-underline hover:bg-gray-700 transition-colors duration-200">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="px-5 py-4 text-sm text-gray-300 bg-gray-950 border-t border-gray-700 whitespace-pre-wrap">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default FAQs