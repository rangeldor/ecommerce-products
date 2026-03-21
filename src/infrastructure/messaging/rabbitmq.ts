import amqplib, { Channel, Connection } from "amqplib";

let connection: Connection | null = null;
let channel: Channel | null = null;

const EXCHANGE_NAME = "user.events";

export async function connectRabbitMQ(): Promise<void> {
	const uri = process.env.RABBITMQ_URI || "amqp://guest:guest@localhost:5672";

	try {
		connection = await amqplib.connect(uri);
		channel = await connection.createChannel();

		await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

		console.log("✅ RabbitMQ connected");

		connection.on("error", (err) => {
			console.error("RabbitMQ connection error:", err);
		});

		connection.on("close", () => {
			console.log("RabbitMQ connection closed");
		});
	} catch (error) {
		console.error("❌ RabbitMQ connection failed:", error);
		throw error;
	}
}

export function getChannel(): Channel {
	if (!channel) {
		throw new Error("RabbitMQ channel not initialized");
	}
	return channel;
}

export async function disconnectRabbitMQ(): Promise<void> {
	if (channel) {
		await channel.close();
		channel = null;
	}
	if (connection) {
		await connection.close();
		connection = null;
	}
	console.log("📦 RabbitMQ disconnected");
}

export { EXCHANGE_NAME };
