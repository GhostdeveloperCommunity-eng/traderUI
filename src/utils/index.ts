import { baseUrl } from "../constants";
import { httpClient } from "../services/ApiService";

const getCompleteUrlV1 = (pathname: string, params: Record<string, string | number | boolean | undefined | null> = {}): string => {
  return buildUrlWithParams(`${baseUrl}/${pathname}`, params);
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

export function buildUrlWithParams(
  baseUrl: string,
 params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}


export { getCompleteUrlV1, uploadImage };
