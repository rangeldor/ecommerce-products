import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
	if (!redis) {
		const url = process.env.REDIS_URL || "redis://localhost:6379";
		redis = new Redis(url, {
			maxRetriesPerRequest: 3,
			lazyConnect: true,
		});

		redis.on("error", (err) => {
			console.error("Redis error:", err);
		});

		redis.on("connect", () => {
			console.log("✅ Redis connected");
		});
	}
	return redis;
}

export async function connectRedis(): Promise<void> {
	const client = getRedis();
	await client.connect();
	await client.ping();
}

export async function disconnectRedis(): Promise<void> {
	if (redis) {
		await redis.quit();
		redis = null;
		console.log("📦 Redis disconnected");
	}
}
