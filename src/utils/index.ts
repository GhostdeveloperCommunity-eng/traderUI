import { baseUrl } from "../constants";

const getCompleteUrlV1 = (pathname: string): string => {
  return `${baseUrl}/api/v1/${pathname}`;
};

export { getCompleteUrlV1 };
