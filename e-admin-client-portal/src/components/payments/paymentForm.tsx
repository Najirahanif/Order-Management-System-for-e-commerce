"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useState } from "react";
import toast from "react-hot-toast";

export default function PaymentForm({
  setPaymentSuccess,
}: any) {

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handlePay = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment-success",
      },
      redirect: "if_required",
    });

    if (result.error) {
      alert(result.error.message);
    }

    if (result.paymentIntent?.status === "succeeded") {
       toast.success("Payment successful 🎉");
      setPaymentSuccess(true);
    }

    setLoading(false);
  };

  return (

    <form onSubmit={handlePay}>

      <PaymentElement />

      <button
        disabled={loading}
        className="w-full bg-black text-white py-2 mt-4"
      >
        {loading ? "Processing..." : "Pay"}
      </button>

    </form>
  );
}