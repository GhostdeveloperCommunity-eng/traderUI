import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {!isLast && item.to ? (
                <>
                  <Link
                    to={item.to}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                  <span className="text-gray-400">{">"}</span>
                </>
              ) : (
                <span className="font-medium text-gray-700">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
