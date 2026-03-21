import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { app } from "./app";
import { connectRedis, disconnectRedis } from "./infrastructure/cache/redis";
import {
	connectRabbitMQ,
	disconnectRabbitMQ,
} from "./infrastructure/messaging/rabbitmq";
import {
	connectDatabase,
	disconnectDatabase,
} from "./infrastructure/persistence/database";
import { seedProducts } from "./infrastructure/seeds/seedProducts";
import { swaggerSpec } from "./infrastructure/swagger/swagger";
import {
	subscribeToEvent,
	startEventConsumer,
	handleUserCreated,
} from "./application/events/eventConsumer";

const PORT = parseInt(process.env.PORT || "3002", 10);

const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
	swaggerOptions: {
		persistAuthorization: true,
	},
};

app.get("/api-docs/spec.json", (_req, res) => {
	res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

async function bootstrap(): Promise<void> {
	try {
		console.log("🚀 Starting Products Service...");

		await connectDatabase();
		console.log("✅ MongoDB connected");

		await connectRedis();
		console.log("✅ Redis connected");

		await connectRabbitMQ();
		console.log("✅ RabbitMQ connected");

		await subscribeToEvent("user.created", handleUserCreated);
		await startEventConsumer();

		if (process.env.RUN_SEEDS === "true") {
			await seedProducts();
		}

		app.listen(PORT, () => {
			console.log(`✅ Products Service running on port ${PORT}`);
			console.log(`   Health: http://localhost:${PORT}/health`);
			console.log(`   API:    http://localhost:${PORT}/products/*`);
			console.log(`   Swagger: http://localhost:${PORT}/api-docs`);
		});
	} catch (error) {
		console.error("❌ Failed to start Products Service:", error);
		process.exit(1);
	}
}

async function shutdown(): Promise<void> {
	console.log("\n🛑 Shutting down Products Service...");

	try {
		await disconnectRabbitMQ();
		await disconnectRedis();
		await disconnectDatabase();
		console.log("✅ Graceful shutdown complete");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error during shutdown:", error);
		process.exit(1);
	}
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap();
