export const FormError = ({ errorText }: { errorText?: string }) => {
  if (!errorText) return null;
  return <p className="text-red-400 text-sm">{errorText}</p>;
};
