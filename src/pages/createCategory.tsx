import { useForm } from "react-hook-form";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { httpClient } from "../services/ApiService";

interface FormValues {
  name: string;
  // file: FileList | null;
  description?: string;
  images: File[] | null;
}

export const CreateCategory = () => {
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      images: null,
    },
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "categories",
  // });

  // const watchCategories = watch("categories");

  // Function to check if the last category is fully filled
  // const canAddCategory = () => {
  //   if (watchCategories.length === 0) return true; // Always allow the first category
  //   const lastCategory = watchCategories[watchCategories.length - 1];
  //   return lastCategory.name.trim() !== "" && lastCategory.file !== null;
  // };

  const onSubmit = async (data: FormValues) => {
    try {
      const { images, ...restDetails } = data;
      let imageUrl = "";
      if (images?.length) {
        imageUrl = await uploadImage(images[0]);
      }
      if(!imageUrl){
        throw("Error no media")
      }
      const response = await httpClient.post(getCompleteUrlV1("category"), {
        ...restDetails,
        media: imageUrl,
      });

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
        <input
          type="text"
          placeholder="Category Name"
          {...register(`name`, {
            required: "Name is required",
          })}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Description"
          {...register(`description`)}
          className="w-full p-2 border rounded"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...register(`images`, {
              required: "Image is required",
            })}
            className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
          />
        </div>
        {/* <Button
          type="button"
          onClick={() => append({ name: "", file: null, description: "" })}
          disabled={!canAddCategory()} // Disable if last category is incomplete
          className="bg-green-500 disabled:bg-gray-400"
        >
          + Add Category
        </Button> */}

        <Button type="submit" className="w-full bg-blue-600">
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default CreateCategory;
