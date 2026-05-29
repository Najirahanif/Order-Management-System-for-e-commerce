import { Kafka, Producer } from "kafkajs";

//docker compose.yaml file for multiple nodes running
const kafka = new Kafka({
  clientId: "order-service",
  brokers: [
    "localhost:19092",
    "localhost:19093",
    "localhost:19094"
  ],
});

// with application ==> server.properties file configuration for
//  sasl authetication and ip whitelisting

// const kafka = new Kafka({
//   clientId: "order-service",
//   brokers: [
//     "192.168.1.23:9092",
//   ], 
//   // Add SASL authentication
//   ssl: false, // Set to true if using SASL_SSL
//   sasl: {
//     mechanism: 'plain',
//     username: process.env.SASL_USERNAME,
//     password: process.env.SASL_PASSWORD 
//   },
// });

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