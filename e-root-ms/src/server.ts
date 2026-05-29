import dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectProducer } from "./config/kafka/kafkaProducer.js";
import orderRoutes from "./routes/order.route.js";
import { connectDB } from "./config/db/db.js";
import redisClient from "./config/redis/redis.js";

const app = Fastify({ logger: true });

app.register(cors, { origin: true });
app.register(orderRoutes);

app.get("/", async () => {
  return {
    service: "e-root-ms",
    status: "running",
  };
});

const start = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    await redisClient.redisConnect();
    console.log("Redis connected");

    await connectProducer();
    console.log("Kafka producer connected");

    await app.listen({
      port: 3100,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3100");

  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();