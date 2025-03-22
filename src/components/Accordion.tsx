import clsx from "clsx";
import { useState } from "react";

const Accordion = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-2">{children}</div>;
};

const AccordionItem = ({
  title,
  children,
  className
}: {
  title: string;
  children: React.ReactNode;
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className= { clsx ("border rounded-lg", className)} >
      <button
        className= "w-full text-left px-4 py-2 bg-gray-100 font-medium rounded-lg flex justify-between items-center"
        onClick={(e) => {
          setIsOpen(!isOpen);
          e.preventDefault();
        }}
      >
        {title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export { Accordion, AccordionItem };
