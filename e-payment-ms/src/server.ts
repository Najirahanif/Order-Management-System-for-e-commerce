import Fastify from "fastify";
import dotenv from "dotenv";
import { connectDB } from "./config/db/db";
import { startConsumer } from "./config/kafka/kafkaConsumer";

dotenv.config();

const app = Fastify({ logger: true });

app.get("/", async () => {
  return { service: "e-payment-ms", status: "running" };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT || 3200);

    // 1. DB first
    await connectDB();

    // 2. Kafka consumer
    await startConsumer();

    // 3. Start server
    await app.listen({ port, host: "0.0.0.0" });

    console.log(`Payment service running on ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();