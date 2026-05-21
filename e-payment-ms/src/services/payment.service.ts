import { PaymentModel } from "../models/payment.model";
import { stripe } from "./stripe.services";

export const createPaymentForOrder = async (order: any) => {
    const orderId = order.orderId || order._id;
    const userId = order.userId;

    if (!orderId || !userId) {
        throw new Error("Invalid order payload");
    }

    const amount = order.products.reduce(
        (sum: number, p: any) => sum + p.price * p.qty,
        0
    );

    // 🔒 1. IDENTITY CHECK (idempotency guard)
    const existing = await PaymentModel.findOne({ orderId });
    if (existing) {
        console.log("Payment already exists for order:", orderId);
        return existing;
    }

    // 🧾 2. Create DB record FIRST (source of truth)
    const payment = await PaymentModel.create({
        orderId,
        userId,
        amount,
        status: "PENDING",
    });

    try {
        const amountInPaise = Math.max(Math.round(amount * 100), 5000);
        // 💳 3. Stripe intent
        const intent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            metadata: {
                orderId,
                userId,
                paymentId: payment._id.toString(),
            },
        });
        // console.log("intentintent", intent);

        // ✅ 4. Update DB after success
        payment.stripePaymentIntentId = intent.id;
        // ✅ correct
        payment.status = "PENDING";
        await payment.save();

        return intent;
    } catch (err) {
        // ❌ 5. rollback state (important)
        payment.status = "FAILED";
        await payment.save();

        throw err;
    }
};