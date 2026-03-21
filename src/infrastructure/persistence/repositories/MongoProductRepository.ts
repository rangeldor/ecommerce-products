import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { IProductDocument, ProductModel } from "../schemas/ProductSchema";

export class MongoProductRepository implements IProductRepository {
	async create(product: Product): Promise<Product> {
		const doc = await ProductModel.create({
			_id: product.id,
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			categoryId: product.categoryId,
			imageUrl: product.imageUrl,
		});
		return this.toDomain(doc);
	}

	async findById(id: string): Promise<Product | null> {
		const doc = await ProductModel.findById(id);
		return doc ? this.toDomain(doc) : null;
	}

	async findAll(): Promise<Product[]> {
		const docs = await ProductModel.find();
		return docs.map(this.toDomain);
	}

	async findByCategoryId(categoryId: string): Promise<Product[]> {
		const docs = await ProductModel.find({ categoryId });
		return docs.map(this.toDomain);
	}

	async update(product: Product): Promise<Product> {
		const doc = await ProductModel.findByIdAndUpdate(
			product.id,
			{
				name: product.name,
				description: product.description,
				price: product.price,
				stock: product.stock,
				categoryId: product.categoryId,
				imageUrl: product.imageUrl,
			},
			{ new: true },
		);
		if (!doc) {
			throw new Error("Product not found");
		}
		return this.toDomain(doc);
	}

	async delete(id: string): Promise<void> {
		await ProductModel.findByIdAndDelete(id);
	}

	async decrementStock(id: string, quantity: number): Promise<void> {
		const result = await ProductModel.findByIdAndUpdate(
			id,
			{ $inc: { stock: -quantity } },
			{ new: true },
		);
		if (!result) {
			throw new Error("Product not found");
		}
		if (result.stock < 0) {
			await ProductModel.findByIdAndUpdate(id, { $inc: { stock: quantity } });
			throw new Error("Insufficient stock");
		}
	}

	private toDomain(doc: IProductDocument): Product {
		return Product.create(
			doc.name,
			doc.description,
			doc.price,
			doc.stock,
			doc.categoryId,
			doc.imageUrl,
			doc._id.toString(),
		);
	}
}
