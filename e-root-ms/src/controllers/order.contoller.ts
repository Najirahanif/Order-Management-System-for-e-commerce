import { FastifyRequest, FastifyReply } from "fastify";

import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
} from "../services/order.service";

/**
 * Create Order Controller
 */
export const createOrderController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const order = await createOrderService(req.body as any);
    return reply.status(201).send(order);
  } catch (err: any) {
    return reply.status(500).send({ error: err.message });
  }
};

/**
 * Get all orders
 */
export const getOrdersController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const orders = await getOrdersService();
    return reply.send(orders);
  } catch (err: any) {
    return reply.status(500).send({ error: err.message });
  }
};

/**
 * Get order by ID
 */
export const getOrderByIdController = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const order = await getOrderByIdService(req.params.id);
    return reply.send(order);
  } catch (err: any) {
    return reply.status(500).send({ error: err.message });
  }
};

/**
 * Update order status
 */
export const updateOrderStatusController = async (
  req: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>,
  reply: FastifyReply
) => {
  try {
    const order = await updateOrderStatusService(
      req.params.id,
      req.body.status
    );
    return reply.send(order);
  } catch (err: any) {
    return reply.status(500).send({ error: err.message });
  }
};