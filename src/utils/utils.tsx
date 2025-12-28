export const capitalize = (value?: string) => (
  console.log("string", value),
  value ? value?.charAt(0)?.toUpperCase() + value?.slice(1) : ""
);
