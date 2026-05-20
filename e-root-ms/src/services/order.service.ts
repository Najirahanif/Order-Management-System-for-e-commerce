import { sendKafkaMessage } from "../config/kafka/kafkaProducer";
import { Order } from "../model/order.model";

interface CreateOrderDTO {
  userId: string;
  products: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[];
}

/**
 * Create Order Service
 */
export const createOrderService = async (data: CreateOrderDTO) => {
  const order = await Order.create({
    ...data,
    status: "PENDING",
  });

  await sendKafkaMessage("order.created", {
    eventType: "ORDER_CREATED",
    orderId: order._id.toString(),
    userId: data.userId,
    products: data.products,
    status: "PENDING",
  });

  return order;
};

/**
 * Get all orders
 */
export const getOrdersService = async () => {
  return await Order.find();
};

/**
 * Get single order by ID
 */
export const getOrderByIdService = async (id: string) => {
  return await Order.findById(id);
};

/**
 * Update order status
 */
export const updateOrderStatusService = async (
  id: string,
  status: string
) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  await sendKafkaMessage("order.updated", {
    eventType: "ORDER_UPDATED",
    orderId: id,
    status,
  });

  return order;
};