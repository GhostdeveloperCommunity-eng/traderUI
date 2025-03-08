import { useState } from "react";

const Accordion = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-2">{children}</div>;
};

const AccordionItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border rounded-lg">
      <button
        className="w-full text-left px-4 py-2 bg-gray-100 font-medium rounded-lg flex justify-between items-center"
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
