import { createPaymentForOrder } from "../../services/payment.service";

export const handleOrderCreated = async (data: any) => {
  console.log("Order received in payment service:", data);

  const paymentIntent = await createPaymentForOrder(data);

  console.log("Stripe payment intent created:", paymentIntent.id);

  // later: emit payment initiated event
};