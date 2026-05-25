import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [
    "192.168.1.23:9092",
  ], // connect using selected ip
  // brokers: [
  //   "localhost:19092",
  //   "localhost:19093",
  //   "localhost:19094"
  // ],   // for comnnecting wuth the local using docker kafka 
  // Add SASL authentication
  ssl: false, // Set to true if using SASL_SSL
  sasl: {
    mechanism: 'plain', // or 'scram-sha-256', 'scram-sha-512'
    username: 'najira',  // Replace with your actual username
    password: 'naji12'   // Replace with your actual password
  },
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