import { Product } from "../../domain/entities/Product";
import { productCache } from "../../infrastructure/cache/ProductCache";
import { MongoProductRepository } from "../../infrastructure/persistence/repositories/MongoProductRepository";

const productRepository = new MongoProductRepository();

interface CachedProduct {
	name: string;
	description: string;
	price: number;
	stock: number;
	categoryId: string;
	imageUrl?: string;
	id: string;
}

export async function getProductById(id: string): Promise<Product | null> {
	const cached = await productCache.getProduct(id);
	if (cached) {
		console.log(`📦 Product ${id} from cache`);
		const c = cached as unknown as CachedProduct;
		return Product.create(
			c.name,
			c.description,
			c.price,
			c.stock,
			c.categoryId,
			c.imageUrl,
			c.id,
		);
	}

	const product = await productRepository.findById(id);
	if (product) {
		await productCache.setProduct(id, product.toJSON());
	}

	return product;
}
