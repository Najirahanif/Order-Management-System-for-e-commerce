"use client";

import { useMemo } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/src/utils/stripeProvider";
import PaymentForm from "./paymentForm";


export default function Payment({
  paymentData,
  totalAmount,
  setPaymentSuccess,
  paymentSuccess,
}: any) {

  const isValidPayment = useMemo(() => {

    return (
      paymentData?.clientSecret &&
      !paymentSuccess
    );

  }, [paymentData, paymentSuccess]);

  if (!isValidPayment) return null;

  return (

    <div className="border p-6 rounded-xl space-y-4 bg-white shadow">

      <h2 className="text-xl font-bold">
        Payment
      </h2>

      <p>Order: {paymentData.orderId}</p>
      <p>Total: ₹{totalAmount}</p>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: paymentData.clientSecret,
        }}
      >

        <PaymentForm
          setPaymentSuccess={setPaymentSuccess}
        />

      </Elements>

    </div>
  );
}