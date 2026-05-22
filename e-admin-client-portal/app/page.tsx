"use client";

import { useState } from "react";

import Products from "@/src/app/products/listProduct";
import CreateOrder from "@/src/components/orders/CreateOrder";

export default function Home() {

  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {

    setCart((prev) => {

      const exists = prev.find((p) => p.id === product.id);

      if (exists) {

        return prev.map((p) =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          qty: 1,
        },
      ];
    });
  };
  const clearCart = () => {
  setCart([]);
};

  const removeFromCart = (id: number) => {

    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  return (

    <div className="grid grid-cols-3 gap-6 p-6">

      <div className="col-span-2">

        <Products onSelect={addToCart} />

      </div>

      <div>

        <CreateOrder
          cart={cart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />

      </div>

    </div>
  );
}