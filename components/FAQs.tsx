"use client";
import { useState } from "react";

interface FAQItem {
  title: string;
  content: string;
}

interface FAQsProps {
  items: FAQItem[];
}
const FAQs: React.FC<FAQsProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div className="bg-gray-900 p-6 rounded lg:w-2/5 break-words z-20">

      {items.map((item, index) => (
        <div key={item.title} className="my-2 border border-blue-900 rounded">
          <button
            type="button"
            onClick={() => handleClick(index)}
            className={`w-full p-4 text-left text-white focus:outline-none ${activeIndex === index ? "bg-gray-800" : "bg-gray-800"
              }`}
          >
            {item.title}
          </button>
          {activeIndex === index && (
            <div className="p-4 border border-gray-700 text-white whitespace-pre-wrap rounded">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQs;