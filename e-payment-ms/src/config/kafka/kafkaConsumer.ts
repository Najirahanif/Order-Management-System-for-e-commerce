import { Consumer } from "kafkajs";
import { kafka } from "./kafkaProducer";
import { createPaymentForOrder } from "../../services/payment.service";
import { createTopicIfNotExists, topics } from "./topics";

export const startConsumer = async (): Promise<void> => {
    const consumer: Consumer = kafka.consumer({
        groupId: "payment-service-group",
    });

    await consumer.connect();

    // 1. Create topics if not exist (bootstrap step)
    for (const topic of topics) {
        await createTopicIfNotExists(kafka, topic);
        await consumer.subscribe({ topic, fromBeginning: false });
    }

    // 2. Start consuming
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const raw = message.value?.toString();
                const data = raw ? JSON.parse(raw) : null;

                console.log("================================");
                console.log("TOPIC:", topic);
                console.log("PARTITION:", partition);
                console.log("RAW KAFKA MESSAGE:", JSON.stringify(data, null, 2));
                console.log("================================");

                if (!data) return;

                await createPaymentForOrder(data);
            } catch (err) {
                console.error("Consumer error:", err);
            }
        },
    });

    console.log("Kafka Consumer started");
};