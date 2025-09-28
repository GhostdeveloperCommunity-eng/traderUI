import { baseUrl } from "../constants";
import { httpClient } from "../services/ApiService";

const getCompleteUrlV1 = (pathname: string): string => {
  return `${baseUrl}/${pathname}`;
};

const uploadImage = async (file: File) => {
  if (!file) return null;

  const uploadUrl = getCompleteUrlV1("feature/upload-image");
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await httpClient.post(uploadUrl, formData);
    const data = await response.json();
    if(data.data?.[0] == "ERROR_IMAGE_URL"){
      throw("Image upload failed")
    }
    return data.data?.[0] || null;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

export { getCompleteUrlV1, uploadImage };
