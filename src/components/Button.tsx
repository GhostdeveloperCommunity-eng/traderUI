import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: "primary" | "success" | "danger" | "gray";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const colorClasses = {
  primary: "bg-blue-500 hover:bg-blue-600",
  success: "bg-green-500 hover:bg-green-600",
  danger: "bg-red-500 hover:bg-red-600",
  gray: "bg-gray-400 hover:bg-gray-500",
 };

const Button = ({
  children,
  className,
  disabled = false,
  color = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "px-4 py-2 rounded-md text-white transition-all",
        colorClasses[color],
        disabled && "opacity-50 cursor-not-allowed hover:bg-grey-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
