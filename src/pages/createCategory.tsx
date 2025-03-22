import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Accordion, AccordionItem } from "../components/Accordion";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";

interface Category {
  name: string;
  subCategory: string;
  file: FileList | null;
  description: string;
}

interface FormValues {
  categories: Category[];
}

export const CreateCategory = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      categories: [
        { name: "", subCategory: "", file: null, description: "desc" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const watchCategories = watch("categories");

  // Function to check if the last category is fully filled
  const canAddCategory = () => {
    if (watchCategories.length === 0) return true; // Always allow the first category
    const lastCategory = watchCategories[watchCategories.length - 1];
    return (
      lastCategory.name.trim() !== "" &&
      lastCategory.subCategory.trim() !== "" &&
      lastCategory.file !== null
    );
  };

  const onSubmit = async (data: FormValues) => {
    const files: File[] = [];
    const filteredCategories = data.categories.map(({ file, ...rest }) => {
      if (file && file.length > 0) {
        files.push(file[0]); // Store only the first file per category
      }
      return rest;
    });

    const formData = new FormData();

    formData.append("items", JSON.stringify(filteredCategories));
    files.forEach((file) => formData.append("image", file));

    try {
      const response = await httpClient.post(
        getCompleteUrlV1("/categories"),
        formData
      );

      if (response.ok) {
        console.log("Categories submitted successfully!");
      } else {
        console.error("Failed to submit categories");
      }
    } catch (error) {
      console.error("Error submitting categories:", error);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Create Categories</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Accordion>
          {fields.map((field, index) => (
            <AccordionItem key={field.id} title={`Category ${index + 1}`}>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  {...register(`categories.${index}.name`, {
                    required: "Name is required",
                  })}
                  className="w-full p-2 border rounded"
                />

                <input
                  type="text"
                  placeholder="Subcategory"
                  {...register(`categories.${index}.subCategory`, {
                    required: " Subcategory is required",
                  })}
                  className="w-full p-2 border rounded"
                />

                <Controller
                  control={control}
                  name={`categories.${index}.file`}
                  rules={{ required: "File is required" }}
                  render={({ field }) => (
                    <div>
                      <input
                        type="file"
                        accept="image/*" // Accept only images
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 1) {
                            setError(`categories.${index}.file`, {
                              message: "Only one file allowed",
                            });
                          } else {
                            clearErrors(`categories.${index}.file`);
                            field.onChange(e.target.files);
                          }
                        }}
                        className="w-full p-2 border rounded"
                      />
                      {errors.categories?.[index]?.file && (
                        <p className="text-red-500 text-sm">
                          {errors.categories[index].file?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {index > 0 && (
                  <Button
                    type="button"
                    className="bg-red-500"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>

        <Button
          type="button"
          onClick={() =>
            append({ name: "", subCategory: "", file: null, description: "" })
          }
          disabled={!canAddCategory()} // Disable if last category is incomplete
          className="bg-green-500 disabled:bg-gray-400"
        >
          + Add Category
        </Button>

        <Button type="submit" className="w-full bg-blue-600">
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default CreateCategory;
