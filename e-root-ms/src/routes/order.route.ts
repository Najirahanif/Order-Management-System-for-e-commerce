

import { FastifyInstance } from "fastify";
import {
  createOrderController,
  getOrdersController,
  updateOrderStatusController
} from "../controllers/order.contoller";

export default async function orderRoutes(app: FastifyInstance) {
  app.post("/createOrder", createOrderController);
  app.get("/orders", getOrdersController);
  app.get("/orders/:id", getOrdersController);
  app.patch("/orders/:id", updateOrderStatusController);
}