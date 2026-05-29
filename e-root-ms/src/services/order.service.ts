import { sendKafkaMessage } from "../config/kafka/kafkaProducer";
import { Order } from "../model/order.model";
import { redisConnect } from "../config/redis/redis";

interface CreateOrderDTO {
  userId: string;
  products: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[];
}

const redis = redisConnect();

/**
 * Create Order Service
 */
export const createOrderService = async (data: CreateOrderDTO) => {
  // 1. Create order in MongoDB
  const order = await Order.create({
    ...data,
    status: "PENDING",
  });

  // 2. Prepare the message
  const message = {
    eventType: "ORDER_CREATED",
    orderId: order._id.toString(),
    userId: data.userId,
    products: data.products,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  // 3. Send to Kafka
  await sendKafkaMessage("orderr.created", message);

  // 4. Store the SAME message in Redis
  const redisKey = `order:${order._id}`;

  await redis.hset(
    redisKey,
    "data",
    JSON.stringify(message)
  );

  await redis.expire(redisKey, 20);

  console.log(`✅ Order ${order._id} stored in Redis and Kafka`);

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