"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/src/utils/stripeProvider";
import PaymentForm from "./paymentForm";

export default function PaymentContainer({
  paymentData,
  setPaymentSuccess,
}: any) {

  return (

    <div className="border p-4">

      <h2>Complete Payment</h2>

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