import React, { useEffect, useState } from "react";

interface DebounceSearchProps {
  products: any[];
  setSearchProduct: (products: any[]) => void;
  placeholder?: string;
}

function DebounceSearch({
  products,
  setSearchProduct,
  placeholder,
}: DebounceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedTerm) {
      setSearchProduct(products);
      return;
    }

    const filteredProducts = products.filter((product) =>
      product.name?.toLowerCase().includes(debouncedTerm.toLowerCase())
    );

    setSearchProduct(filteredProducts);
  }, [debouncedTerm, products, setSearchProduct]);

  return (
    <input
      type="text"
      placeholder={`${placeholder || "Search..."}`}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
    />
  );
}

export default DebounceSearch;
