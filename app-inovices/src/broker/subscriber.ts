import { orders } from "./channels/orders.ts";

orders.consume(
  "orders",
  async (message) => {
    if (!message) {
      console.error("[Invoices] No message received");
      return null;
    }

    console.log("[Invoices] New order received:", message?.content.toString());

    orders.ack(message);
  },
  {
    noAck: false,
  }
);
