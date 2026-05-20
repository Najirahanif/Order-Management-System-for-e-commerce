"use client";

import { useProducts } from "@/src/data/query/product";

export default function Products({ onSelect }: any) {
  const { data, isLoading } = useProducts();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((product: any) => (
        <div
          key={product.id}
          onClick={() => onSelect(product)}
          className="border p-3 rounded cursor-pointer hover:shadow"
        >
          <img src={product.thumbnail} className="h-32 w-full object-cover" />
          <h2 className="font-bold">{product.title}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}