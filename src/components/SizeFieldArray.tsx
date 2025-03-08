import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { IMasterProduct } from "../types";
import { AccordionItem } from "./Accordion";

interface SizeFieldArrayProps {
  nestIndex: number;
  control: Control<IMasterProduct>;
  register: UseFormRegister<IMasterProduct>;
}

const SizeFieldArray: React.FC<SizeFieldArrayProps> = ({
  nestIndex,
  control,
  register,
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `varients.${nestIndex}.sizeMrp` as const,
  });
  console.log({ fields }, "sizess");

  return (
    <div className="mt-4 p-3 flex flex-col gap-y-2 rounded-lg bg-white shadow-sm">
      {fields.map((size, k) => (
        <AccordionItem key={k} title={`Size - ${k + 1}`}>
          <div
            key={size.id}
            className=" font-sm flex items-center gap-x-4 gap-y-2 mb-2"
          >
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Size:</label>
              <input
                {...register(`varients.${nestIndex}.sizeMrp.${k}.size`)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Mrp:</label>
              <input
                type="number"
                {...register(`varients.${nestIndex}.sizeMrp.${k}.mrp`)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              type="button"
              onClick={() => remove(k)}
              className="bg-red-500 self-end text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </AccordionItem>
      ))}

      <button
        type="button"
        onClick={() => append({ size: "", mrp: "" })}
        className=" w-fit bg-green-500 mt-1 cursor-pointer text-white px-4 py-1 rounded-md hover:bg-green-600"
      >
        Add Size
      </button>
    </div>
  );
};

export default SizeFieldArray;
