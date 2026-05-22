import Fastify from "fastify";
import dotenv from "dotenv";

import { connectDB } from "./config/db/db";
import { startConsumers } from "./config/kafka/kafkaConsumer";
import { initSocket } from "./config/socket/socket";

dotenv.config();

const app = Fastify({
    logger: true,
});

app.get("/", async () => {

    return {
        service: "e-payment-ms",
        status: "running",
    };
});

const start = async () => {

    try {

        const port = Number(
            process.env.PORT || 3200
        );

        // ✅ DB
        await connectDB();

        // ✅ Start Fastify server
        await app.listen({
            port,
            host: "0.0.0.0",
        });

        // ✅ Attach Socket.IO
        initSocket(app.server);

        // ✅ Start Kafka consumers
        await startConsumers();

        console.log(
            `Payment service running on ${port}`
        );

    } catch (err) {

        app.log.error(err);

        process.exit(1);
    }
};

start();