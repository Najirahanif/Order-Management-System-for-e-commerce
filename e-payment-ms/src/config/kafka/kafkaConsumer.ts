import { Consumer } from "kafkajs";
import { kafka } from "./kafkaProducer";
import { createPaymentForOrder } from "../../services/payment.service";
import { createTopicIfNotExists, topics } from "./topics";


export const createConsumer = async (id: number): Promise<Consumer> => {

    // 🧠 Creates a Kafka consumer instance
    // groupId = "payment-service-group"
    // 👉 All consumers with same groupId share partitions (load balancing)
    // 👉 This enables horizontal scaling (your 3 consumers below)
    const consumer = kafka.consumer({
        groupId: "payment-service-group",
    });

    // 🔌 Establish connection to Kafka cluster
    // If this fails → consumer will not start at all
    await consumer.connect();

    // 📦 Subscribe this consumer to all topics in `topics` array
    for (const topic of topics) {

        // ⚠️ Potential hidden issue:
        // You are creating topics at runtime here.
        // In production, topic creation is usually handled by infra/admins,
        // NOT consumer services (can cause race conditions under scale)
        await createTopicIfNotExists(kafka, topic);

        // 👇 Subscribe consumer to topic
        // fromBeginning: false → start from latest offset (no replay of old data)
        await consumer.subscribe({ topic, fromBeginning: false });
    }

    // 🚀 Start consuming messages
    await consumer.run({

        // ⚠️ IMPORTANT:
        // You did NOT disable autoCommit here.
        // KafkaJS will auto-commit offsets in the background by default.
        //
        // This means:
        // 👉 offset commit is NOT tied to createPaymentForOrder()
        // 👉 risk: message may be marked "done" before DB write finishes
        eachMessage: async ({ topic, partition, message }) => {

            try {

                // 📥 Kafka message value comes as Buffer → convert to string
                const rawMessage = message.value?.toString();

                // 🧯 Defensive check for empty/null messages
                if (!rawMessage) {
                    console.log(`Consumer-${id} EMPTY MESSAGE`);
                    return;
                }

                // 🧠 Parse business payload (assumes valid JSON)
                // ⚠️ Risk: malformed JSON will throw and go to catch block
                const data = JSON.parse(rawMessage);

                // 📊 Debug logging block (useful for tracing offsets in dev)
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

                // 💰 BUSINESS LOGIC EXECUTION
                // This is the most critical part:
                // 👉 You are processing payment creation here
                // 👉 This is NOT transactional with Kafka offset commit
                await createPaymentForOrder(data);

                // ✅ Success log after processing
                console.log(
                    `✅ Consumer-${id} processed offset ${message.offset} from partition ${partition}`
                );

                // ⚠️ IMPORTANT BEHAVIOR (NOT SHOWN IN CODE)
                // Since autoCommit is enabled by default:
                // Kafka will commit offsets periodically in background
                //
                // That means:
                // ❗ this log does NOT guarantee commit happened yet
                // ❗ commit timing is NOT tied to DB success

            } catch (err) {

                // ❌ Any failure lands here:
                // - JSON parse error
                // - DB failure in createPaymentForOrder
                // - unexpected runtime errors

                console.error(`
❌ Consumer-${id} ERROR
Topic      : ${topic}
Partition  : ${partition}
Offset     : ${message.offset}

`, err);

                // ⚠️ CRITICAL BEHAVIOR:
                // Because autoCommit is likely enabled:
                // 👉 Kafka may still commit this offset later
                // 👉 This can cause DATA LOSS (message marked done even though failed)

                // OR alternatively:
                // 👉 if commit hasn't happened yet, message will be retried after restart
            }
        },
    });

    // 🔁 Return consumer instance so caller can manage lifecycle if needed
    return consumer;
};

export const createManualCommitConsumer = async (
    id: number
): Promise<Consumer> => {

    const consumer = kafka.consumer({
        groupId: "payment-service-group",
    });

    await consumer.connect();

    for (const topic of topics) {

        await createTopicIfNotExists(kafka, topic);

        await consumer.subscribe({
            topic,
            fromBeginning: false,
        });
    }

    await consumer.run({
        autoCommit: false,

        eachMessage: async ({
            topic,
            partition,
            message,
            heartbeat,
        }) => {

            // 🛑 Explicitly pause this topic-partition
            consumer.pause([
                {
                    topic,
                    partitions: [partition],
                },
            ]);

            try {

                const raw = message.value?.toString();

                if (!raw) {
                    console.log(`Consumer-${id} EMPTY MESSAGE`);
                    return;
                }

                const data = JSON.parse(raw);

                let attempt = 0;
                const maxRetries = 3;

                while (attempt < maxRetries) {

                    try {

                        console.log(`
========================================
Consumer ID : Consumer-${id}
Topic       : ${topic}
Partition   : ${partition}
Offset      : ${message.offset}
Attempt     : ${attempt + 1}
========================================
                        `);

                        // 💰 BUSINESS LOGIC
                        await createPaymentForOrder(data);

                        // 🫀 Prevent rebalance
                        await heartbeat();

                        // 📌 Manual Commit
                        await consumer.commitOffsets([
                            {
                                topic,
                                partition,
                                offset: (
                                    Number(message.offset) + 1
                                ).toString(),
                            },
                        ]);

                        console.log(`
✅ Consumer-${id} SUCCESS
Committed Offset : ${Number(message.offset) + 1}
                        `);

                        return;

                    } catch (err) {

                        attempt++;

                        console.error(`
❌ Consumer-${id} ERROR
Topic      : ${topic}
Partition  : ${partition}
Offset     : ${message.offset}
Retry      : ${attempt}
                        `, err);

                        await heartbeat();

                        await new Promise((res) =>
                            setTimeout(res, 1000 * attempt)
                        );
                    }
                }

                console.error(`
💀 Consumer-${id} FAILED PERMANENTLY
Offset : ${message.offset}
                `);

            } finally {

                // ▶ Resume partition ALWAYS
                consumer.resume([
                    {
                        topic,
                        partitions: [partition],
                    },
                ]);
            }
        },
    });

    return consumer;
};

export const startConsumers = async (): Promise<void> => {
    await Promise.all([
        // createConsumer(1),
        // createConsumer(2),
        // createConsumer(3),
        createManualCommitConsumer(1),
        createManualCommitConsumer(2),
        createManualCommitConsumer(3)
    ]);

    console.log("3 Kafka Consumers started");
};