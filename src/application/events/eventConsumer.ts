import { ConsumeMessage } from "amqplib";
import { getChannel, EXCHANGE_NAME } from "../../infrastructure/messaging/rabbitmq";

export interface UserCreatedEvent {
	eventType: "user.created";
	userId: string;
	email: string;
	timestamp: string;
}

export type EventHandler = (event: UserCreatedEvent) => Promise<void>;

const consumers: Map<string, EventHandler[]> = new Map();

export async function subscribeToEvent(
	eventType: string,
	handler: EventHandler,
): Promise<void> {
	if (!consumers.has(eventType)) {
		consumers.set(eventType, []);
	}
	consumers.get(eventType)!.push(handler);

	console.log(`📥 Subscribed to event: ${eventType}`);
}

async function handleMessage(msg: ConsumeMessage | null): Promise<void> {
	if (!msg) return;

	const channel = getChannel();
	const content = msg.content.toString();
	const routingKey = msg.fields.routingKey;

	try {
		const event = JSON.parse(content);
		console.log(`📬 Event received: ${routingKey}`, event);

		const handlers = consumers.get(routingKey) || [];
		for (const handler of handlers) {
			try {
				await handler(event);
			} catch (err) {
				console.error(`Error handling event ${routingKey}:`, err);
			}
		}

		channel.ack(msg);
	} catch (err) {
		console.error("Error processing message:", err);
		channel.nack(msg, false, false);
	}
}

export async function startEventConsumer(): Promise<void> {
	const channel = getChannel();
	const queueName = "products-service-queue";

	await channel.assertQueue(queueName, { durable: true });

	const eventTypes = Array.from(consumers.keys());
	for (const eventType of eventTypes) {
		await channel.bindQueue(queueName, EXCHANGE_NAME, eventType);
	}

	await channel.consume(queueName, handleMessage, { noAck: false });

	console.log(`🔔 Event consumer started for: ${eventTypes.join(", ")}`);
}

export async function handleUserCreated(event: UserCreatedEvent): Promise<void> {
	console.log(
		`👤 User created event received: ${event.email} (${event.userId})`,
	);
}
