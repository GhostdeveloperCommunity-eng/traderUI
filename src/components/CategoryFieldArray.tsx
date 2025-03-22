import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import SizeFieldArray from "./SizeFieldArray";
import { CategoryFieldArrayProps } from "../types";
import { genders } from "../constants";
import { AccordionItem } from "./Accordion";
import { MdDelete } from "react-icons/md";

const CategoryFieldArray: React.FC<CategoryFieldArrayProps> = ({
  control,
  register,
  getValues,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "varients",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        name: "",
        slug: "",
        gender: "",
        images: null,
        sizeMrp: [{ size: "", mrp: "0" }],
      });
    }
  }, [fields, append]);

  return (
    <div className="flex flex-col gap-x-4 gap-y-2">
      {fields.map((category, index) => (
        <AccordionItem key={category.id} title={`Variant - ${index + 1}`}>
          <div className=" relative font-sm px-4 rounded-lg">
            <div
              key={category.id}
              className=" grid grid-cols-2 gap-x-4 gap-y-2  "
            >
              <div className="mb-2">
                <label className="block text-gray-700 ">Variant Name:</label>
                <input
                  {...register(`varients.${index}.name`)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 ">Slug</label>
                <input
                  {...register(`varients.${index}.slug`)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 ">Gender</label>
                <select
                  {...register(`varients.${index}.gender`, {
                    required: "Category is required",
                  })}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender.code} value={gender.code}>
                      {gender.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 ">Variant Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register(`varients.${index}.images`, {
                    required: "Image is required",
                  })}
                  className="w-full p-2 border rounded-md"
                />          
              </div>

              {/* Nested Sizes */}
            </div>

            <SizeFieldArray nestIndex={index} {...{ control, register }} />
            <MdDelete
              type="button"
              onClick={() => fields.length > 1 && remove(index)}
              className=" absolute right-[30px] top-[-60px] w-7 h-7 cursor-pointer bg-red-200 mt-2 text-red-700 px-[6px] py-[3px] rounded-md hover:bg-red-300"
            />
          </div>
        </AccordionItem>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            ...getValues(`varients.${fields.length - 1}`),
          })
        }
        className=" w-fit bg-green-500  text-white p-1 px-2 cursor-pointer rounded-md hover:bg-green-600"
      >
        Add Variant
      </button>
    </div>
  );
};

export default CategoryFieldArray;
