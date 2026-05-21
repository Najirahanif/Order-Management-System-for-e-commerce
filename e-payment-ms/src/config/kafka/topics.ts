

import { Kafka } from "kafkajs";

export const topics = ["orderr.created"];

export const createTopicIfNotExists = async (kafka: Kafka, topic: string) => {
    const admin = kafka.admin();

    try {
        await admin.connect();

        const existingTopics = await admin.listTopics();

        if (!existingTopics.includes(topic)) {
            await admin.createTopics({
                topics: [
                    {
                        topic,
                        numPartitions: 6,
                        replicationFactor: 1,
                    },
                ],
            });

            console.log(`Topic created: ${topic}`);
        }
    } finally {
        await admin.disconnect();
    }
};