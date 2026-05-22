"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Stripe redirects can include query params like:
    // payment_intent, payment_intent_client_secret, redirect_status

    const paymentIntent = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");

    if (!paymentIntent) {
      return;
    }

    setPaymentInfo({
      paymentIntent,
      status: redirectStatus,
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white border rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">

        {/* ICON */}
        <div className="text-6xl">🎉</div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful
        </h1>

        <p className="text-gray-500">
          Your transaction has been completed successfully.
        </p>

        {/* DETAILS */}
        {paymentInfo && (
          <div className="text-left bg-gray-100 p-4 rounded-xl space-y-2 text-sm">
            <p>
              <span className="font-semibold">Payment Intent:</span>{" "}
              {paymentInfo.paymentIntent}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              {paymentInfo.status}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-black text-white py-2 rounded-lg"
          >
            Go Home
          </button>

          <button
            onClick={() => router.push("/order")}
            className="flex-1 border py-2 rounded-lg"
          >
            View Orders
          </button>
        </div>

      </div>
    </div>
  );
}