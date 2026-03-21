import { productCache } from "../../infrastructure/cache/ProductCache";
import { MongoProductRepository } from "../../infrastructure/persistence/repositories/MongoProductRepository";

const productRepository = new MongoProductRepository();

export async function deleteProduct(id: string): Promise<void> {
	const existingProduct = await productRepository.findById(id);
	if (!existingProduct) {
		throw new Error("Product not found");
	}

	await productRepository.delete(id);
	await productCache.invalidateProduct(id);

	console.log(`🗑️ Product deleted: ${id}`);
}
