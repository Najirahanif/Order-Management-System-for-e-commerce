"use client";

export default function PaymentSuccess({
    paymentData,
    totalAmount,
    cart = [],
}: any) {
    if (!paymentData) {
        return (
            <div className="p-6 text-center text-red-500">
                Payment data missing
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white border rounded-2xl shadow-lg overflow-hidden">

            {/* HEADER */}
            <div className="bg-green-600 text-white p-6 text-center">
                <h2 className="text-2xl font-bold">
                    🎉 Payment Successful
                </h2>
                <p className="text-sm mt-1 opacity-90">
                    Thank you for your order
                </p>
            </div>

            {/* ORDER INFO */}
            <div className="p-6 space-y-4">

                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-medium">
                        {paymentData.orderId}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment ID</span>
                    <span className="font-medium">
                        {paymentData.paymentId}
                    </span>
                </div>

                <hr />

                {/* ITEMS */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                        Order Summary
                    </h3>

                    {paymentData?.items?.length > 0 ? (
                        paymentData.items.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex justify-between text-sm"
                            >
                                <span>
                                    {item.title} × {item.qty}
                                </span>

                                <span>
                                    ₹{item.price * item.qty}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">
                            Items not available
                        </p>
                    )}
                </div>

                <hr />

                {/* TOTAL */}
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                        Total Paid
                    </span>

                    <span className="text-2xl font-bold text-green-700">
                        ₹{totalAmount}
                    </span>
                </div>

                {/* BUTTON (optional UX improvement) */}
                <button className="w-full mt-4 bg-black text-white py-3 rounded-xl hover:opacity-90">
                    Continue Shopping
                </button>

            </div>
        </div>
    );
}