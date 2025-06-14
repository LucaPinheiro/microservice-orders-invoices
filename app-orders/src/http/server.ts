import "@opentelemetry/auto-instrumentations-node/register";

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

import { trace } from "@opentelemetry/api";

import { schema } from "../db/schema/index.ts";
import { db } from "../db/client.ts";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import { create } from "node:domain";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";
import { tracer } from "../tracer/tracer.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: "*" });

app.get("/health", () => {
  return { status: "ok" };
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.coerce.number().min(1),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body;

    console.log("[Orders] New order received:", amount);

    const orderId = randomUUID();
    console.log("[Orders] New order ID generated:", orderId);

    dispatchOrderCreated({
      orderId: orderId,
      amount,
      customer: {
        id: "1234",
      },
      status: "pending",
      createdAt: new Date(),
    });
    
    await db.insert(schema.orders).values({
      id: orderId,
      amount,
      customerId: "1234",
      status: "pending",
      createdAt: new Date(),
    });

    const span = tracer.startSpan('Eu acho que aqui esta dando xabu')

    span.setAttribute('teste', 'hello World')

    await setTimeout(2000);
    span.end()

    trace.getActiveSpan()?.setAttribute("order.id", orderId);

    return reply.status(201).send();
  }
);
console.log("[Orders] deu bom"),
  app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
    console.log("[Orders] HTTP Server running!");
  });
