import clsx from "clsx";

const Button = ({ children, className, ...props }: any) => (
  <button
    className={clsx(
      "px-4 rounded-md cursor-pointer py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
export { Button };
