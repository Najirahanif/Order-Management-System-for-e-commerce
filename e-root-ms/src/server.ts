import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectProducer } from "./config/kafka/kafkaProducer.js";
import orderRoutes from "./routes/order.route.js";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db/db.js";


const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: true,
});
app.register(orderRoutes);

// health check
app.get("/", async () => {
  return {
    service: "e-root-ms",
    status: "running",
  };
});

const start = async () => {
  try {
    // 1. CONNECT DATABASE FIRST
    await connectDB();
    console.log("MongoDB connected");

    // 2. CONNECT KAFKA
    await connectProducer();
    console.log("Kafka producer connected");

    // 3. START SERVER
    await app.listen({ port: 3100, host: "0.0.0.0" });

    console.log("Server running on port 3100");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};
start();