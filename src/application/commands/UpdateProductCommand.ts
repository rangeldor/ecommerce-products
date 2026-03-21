import { Product } from "../../domain/entities/Product";
import { productCache } from "../../infrastructure/cache/ProductCache";
import { MongoProductRepository } from "../../infrastructure/persistence/repositories/MongoProductRepository";
import { UpdateProductInput } from "../../infrastructure/validation/ProductValidator";

const productRepository = new MongoProductRepository();

export interface UpdateProductResult {
	product: Product;
}

export async function updateProduct(
	id: string,
	input: UpdateProductInput,
): Promise<UpdateProductResult> {
	const existingProduct = await productRepository.findById(id);
	if (!existingProduct) {
		throw new Error("Product not found");
	}

	const updatedProduct = Product.create(
		input.name ?? existingProduct.name,
		input.description ?? existingProduct.description,
		input.price ?? existingProduct.price,
		input.stock ?? existingProduct.stock,
		input.categoryId ?? existingProduct.categoryId,
		input.imageUrl ?? existingProduct.imageUrl,
		id,
	);

	await productRepository.update(updatedProduct);
	await productCache.invalidateProduct(id);

	console.log(`✅ Product updated: ${updatedProduct.name}`);

	return { product: updatedProduct };
}
