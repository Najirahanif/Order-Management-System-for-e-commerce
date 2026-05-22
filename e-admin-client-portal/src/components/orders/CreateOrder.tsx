"use client";

import { useEffect, useState } from "react";

import { socket } from "@/src/utils/socket";
import { useCreateOrder } from "@/src/data/query/orders";

import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import OrderActions from "./OrderActions";
import PaymentContainer from "../payments/PaymentContainer";
import PaymentSuccess from "./PaymentSuccess";

export default function CreateOrder({
  cart,
  removeFromCart,
  clearCart
}: any) {
  console.log("cartcart",cart);

  const { mutate, isPending } = useCreateOrder();

  const [userId, setUserId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paidOrder, setPaidOrder] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const totalAmount = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.qty,
    0
  );

  useEffect(() => {

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("payment-created", (data) => {
      console.log("PAYMENT RECEIVED:", data);
      setPaymentData(data);
    });

    return () => {
      socket.off("connect");
      socket.off("payment-created");
    };

  }, []);

  const placeOrder = () => {

    if (!userId) return;

    mutate(
      {
        userId,
        products: cart,
      },
      {
        onSuccess: (res: any) => {

          const orderId = res?._id;
          if (!orderId) return;

          socket.emit("join-order-room", orderId);
        },
      }
    );
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);

    setPaidOrder({
      orderId: paymentData.orderId,
      paymentId: paymentData.paymentId,
      amount: totalAmount,
      items: cart,
    });

    setPaymentData(null);
     clearCart();
  };

  return (

    <div className="space-y-4">

      <input
        className="border p-2 w-full"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <CartItems
        cart={cart}
        removeFromCart={removeFromCart}
      />

      <OrderSummary cart={cart} />

      <OrderActions
        placeOrder={placeOrder}
        isPending={isPending}
      />

      {paymentSuccess ? (
        <PaymentSuccess
          paymentData={paidOrder}
          totalAmount={paidOrder?.amount}
        />
      ) : (
        paymentData && (
          <PaymentContainer
            paymentData={paymentData}
            setPaymentSuccess={handlePaymentSuccess}
          />
        )
      )}

    </div>
  );
}