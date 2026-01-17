export const capitalize = (value?: string) => (
  console.log("string", value),
  value ? value?.charAt(0)?.toUpperCase() + value?.slice(1) : ""
);

export const formatDate = (date?: Date | string): string => {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
};
