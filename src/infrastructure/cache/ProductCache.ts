import { getRedis } from "./redis";

const CACHE_TTL = parseInt(process.env.CACHE_TTL_PRODUCTS || "300", 10);

export const productCache = {
	async getProduct(id: string): Promise<object | null> {
		const redis = getRedis();
		const cached = await redis.get(`products:detail:${id}`);
		return cached ? JSON.parse(cached) : null;
	},

	async setProduct(id: string, product: object): Promise<void> {
		const redis = getRedis();
		await redis.setex(
			`products:detail:${id}`,
			CACHE_TTL,
			JSON.stringify(product),
		);
	},

	async getProductList(key: string): Promise<object[] | null> {
		const redis = getRedis();
		const cached = await redis.get(`products:list:${key}`);
		return cached ? JSON.parse(cached) : null;
	},

	async setProductList(key: string, products: object[]): Promise<void> {
		const redis = getRedis();
		await redis.setex(
			`products:list:${key}`,
			CACHE_TTL,
			JSON.stringify(products),
		);
	},

	async invalidateProduct(id: string): Promise<void> {
		const redis = getRedis();
		await redis.del(`products:detail:${id}`);
		const keys = await redis.keys("products:list:*");
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	},

	async invalidateAllProducts(): Promise<void> {
		const redis = getRedis();
		const keys = await redis.keys("products:*");
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	},
};
