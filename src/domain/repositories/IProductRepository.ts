import { Product } from "../entities/Product";

export interface IProductRepository {
	create(product: Product): Promise<Product>;
	findById(id: string): Promise<Product | null>;
	findAll(): Promise<Product[]>;
	findByCategoryId(categoryId: string): Promise<Product[]>;
	update(product: Product): Promise<Product>;
	delete(id: string): Promise<void>;
	decrementStock(id: string, quantity: number): Promise<void>;
}
