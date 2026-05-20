"use client";

import { useCreateOrder } from "@/src/data/query/orders";
import { useState } from "react";

export default function CreateOrder({ cart, removeFromCart }: any) {
  const { mutate, isPending, data } = useCreateOrder();
  const [userId, setUserId] = useState("");

  const placeOrder = () => {
    mutate({
      userId,
      products: cart.map((item: any) => ({
        productId: item.id,
        name: item.title,
        qty: item.qty,
        price: item.price,
      })),
    });
  };

  return (
    <div className="border p-4 rounded-xl shadow-md">

      <h2 className="font-bold mb-3">Cart</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* CART LIST */}
      {cart.length === 0 ? (
        <p className="text-gray-500">No products selected</p>
      ) : (
        cart.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between items-center mb-2 border p-2"
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm">
                {item.qty} × ${item.price}
              </p>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500"
            >
              X
            </button>
          </div>
        ))
      )}

      {/* PLACE ORDER */}
      <button
        className="bg-black text-white w-full py-2 mt-3 rounded"
        disabled={isPending || cart.length === 0}
        onClick={placeOrder}
      >
        {isPending ? "Creating..." : "Create Order"}
      </button>

      {/* RESPONSE */}
      {data && (
        <pre className="mt-3 bg-gray-100 p-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}