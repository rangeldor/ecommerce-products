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

export interface ListProductsFilters {
	categoryId?: string;
	search?: string;
}

export async function listProducts(
	filters?: ListProductsFilters,
): Promise<Product[]> {
	const cacheKey = filters?.categoryId ?? filters?.search ?? "all";

	const cached = await productCache.getProductList(cacheKey);
	if (cached) {
		console.log("📦 Product list from cache");
		return (cached as unknown as CachedProduct[]).map((p) =>
			Product.create(
				p.name,
				p.description,
				p.price,
				p.stock,
				p.categoryId,
				p.imageUrl,
				p.id,
			),
		);
	}

	let products: Product[];

	if (filters?.categoryId) {
		products = await productRepository.findByCategoryId(filters.categoryId);
	} else {
		products = await productRepository.findAll();
	}

	await productCache.setProductList(
		cacheKey,
		products.map((p) => p.toJSON()),
	);

	return products;
}
