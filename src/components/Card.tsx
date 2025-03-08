import clsx from "clsx";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={clsx(
      "p-6 max-w-2xl mx-auto mt-10 shadow-lg bg-white rounded-lg",
      className
    )}
  >
    {children}
  </div>
);

export { Card };
