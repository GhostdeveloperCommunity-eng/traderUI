import { baseUrl } from "../constants";

const getCompleteUrlV1 = (pathname: string): string => {
  return `${baseUrl}/api/${pathname}`;
};

export { getCompleteUrlV1 };
