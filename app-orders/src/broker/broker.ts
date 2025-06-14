import amqp from "amqplib"

if (!process.env.BROKER_URL) {
  throw new Error("BROKER_URL environment variable is not set")
}
console.log("Connecting to broker at", process.env.BROKER_URL)
export const broker = await amqp.connect(process.env.BROKER_URL)