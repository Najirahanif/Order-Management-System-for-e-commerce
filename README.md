This project is a scalable event-driven e-commerce platform designed using distributed microservice architecture principles.
The system is divided into independent services including e-client-portal, e-admin, e-root-ms, and e-payment-ms.

The frontend applications are built using Next.js and communicate with backend services through REST APIs and realtime socket connections.
Backend services are developed using Fastify with TypeScript for lightweight, high-performance server execution.

The architecture uses Apache Kafka as the central event streaming backbone for asynchronous communication between services.
Instead of tightly coupling services through direct API dependency, events are published and consumed independently, enabling loose coupling and better scalability.

The e-root-ms service manages order creation, inventory handling, and Kafka event production.
When a customer places an order, the service emits an order.created event into Kafka.

The e-payment-ms service acts as an asynchronous Kafka consumer.
It listens to payment-related events, creates payment records, generates Stripe payment intents using Stripe, and updates payment lifecycle states.

Kafka partitions are used for parallel event processing and horizontal scalability.
Messages are produced using orderId as the partition key, ensuring ordering consistency for events belonging to the same order while still enabling concurrent processing across multiple consumers.

The system currently uses 6 Kafka partitions, allowing scalable consumer-group-based processing under high traffic conditions.

Realtime payment status updates are implemented using socket communication.
Once payment events are processed, connected frontend clients receive instant updates without polling, enabling realtime order and payment tracking.

Data persistence is handled using MongoDB, while Redis is integrated for fast-access caching and future distributed coordination features.

The complete infrastructure is containerized using Docker and managed through Docker Compose, enabling reproducible local development and isolated service execution.

The project demonstrates practical implementation of:

event-driven architecture
Kafka consumer groups
partition-based distributed processing
asynchronous payment orchestration
realtime socket communication
microservice scalability patterns
distributed backend system design

This architecture is intentionally designed around scalability and service independence rather than monolithic request-response flows.
