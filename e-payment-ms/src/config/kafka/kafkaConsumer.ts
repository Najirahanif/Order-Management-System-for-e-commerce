import { Consumer } from "kafkajs";
import { kafka } from "./kafkaProducer";
import { createPaymentForOrder } from "../../services/payment.service";
import { createTopicIfNotExists, topics } from "./topics";

export const createConsumer = async (id: number): Promise<Consumer> => {
    const consumer = kafka.consumer({
        groupId: "payment-service-group",
    });

    await consumer.connect();

    for (const topic of topics) {
        await createTopicIfNotExists(kafka, topic);
        await consumer.subscribe({ topic, fromBeginning: false });
    }

    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        try {
            const rawMessage = message.value?.toString();

            if (!rawMessage) {
                console.log(`Consumer-${id} EMPTY MESSAGE`);
                return;
            }

            const data = JSON.parse(rawMessage);

            console.log(`
========================================
Consumer ID : Consumer-${id}
Topic       : ${topic}
Partition   : ${partition}
Offset      : ${message.offset}
Key         : ${message.key?.toString() || "NO_KEY"}
Timestamp   : ${message.timestamp}

Message Data:
${JSON.stringify(data, null, 2)}
========================================
            `);

            await createPaymentForOrder(data);

            console.log(
                `✅ Consumer-${id} processed offset ${message.offset} from partition ${partition}`
            );

        } catch (err) {
            console.error(`
❌ Consumer-${id} ERROR
Topic      : ${topic}
Partition  : ${partition}
Offset     : ${message.offset}

`, err);
        }
    },
});
    return consumer;
};

export const startConsumers = async (): Promise<void> => {
    await Promise.all([
        createConsumer(1),
        createConsumer(2),
        createConsumer(3),
    ]);

    console.log("3 Kafka Consumers started");
};