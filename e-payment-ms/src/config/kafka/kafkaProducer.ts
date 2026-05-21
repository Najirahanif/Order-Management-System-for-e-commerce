import { Kafka, Producer } from "kafkajs";

export const kafka = new Kafka({
  clientId: "order-service",
  brokers: [
  "localhost:19092",
]
});


const producer: Producer = kafka.producer();

/**
 * Kafka message shape
 */
interface KafkaMessage {
  orderId: string;
  [key: string]: any;
}

/**
 * Connect producer
 */
export const connectProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (err) {
    console.error("Kafka connection failed:", err);
    process.exit(1);
  }
};

/**
 * Send message to Kafka topic
 */
export const sendKafkaMessage = async (
  topic: string,
  message: KafkaMessage
): Promise<void> => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: message.orderId,
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(`Event sent → ${topic}`);
  } catch (err) {
    console.error("Kafka send failed:", err);
  }
};