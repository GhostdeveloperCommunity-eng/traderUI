import { baseUrl } from "../constants";

const getCompleteUrlV1 = (pathname: string): string => {
  return `${baseUrl}/${pathname}`;
};

export { getCompleteUrlV1 };
