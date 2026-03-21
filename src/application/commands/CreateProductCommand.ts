import { Product } from "../../domain/entities/Product";
import { productCache } from "../../infrastructure/cache/ProductCache";
import { MongoProductRepository } from "../../infrastructure/persistence/repositories/MongoProductRepository";
import { CreateProductInput } from "../../infrastructure/validation/ProductValidator";

const productRepository = new MongoProductRepository();

export interface CreateProductResult {
	product: Product;
}

export async function createProduct(
	input: CreateProductInput,
): Promise<CreateProductResult> {
	const product = Product.create(
		input.name,
		input.description,
		input.price,
		input.stock,
		input.categoryId,
		input.imageUrl,
	);

	await productRepository.create(product);
	await productCache.setProduct(product.id, product.toJSON());

	console.log(`✅ Product created: ${product.name}`);

	return { product };
}
