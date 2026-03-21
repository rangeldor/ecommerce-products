import { randomUUID } from "crypto";

export interface ProductProps {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly price: number;
	readonly stock: number;
	readonly categoryId: string;
	readonly imageUrl?: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export class Product {
	private constructor(private readonly props: ProductProps) {}

	static create(
		name: string,
		description: string,
		price: number,
		stock: number,
		categoryId: string,
		imageUrl?: string,
		id?: string,
	): Product {
		return new Product({
			id: id ?? randomUUID(),
			name,
			description,
			price,
			stock,
			categoryId,
			imageUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	get id(): string {
		return this.props.id;
	}

	get name(): string {
		return this.props.name;
	}

	get description(): string {
		return this.props.description;
	}

	get price(): number {
		return this.props.price;
	}

	get stock(): number {
		return this.props.stock;
	}

	get categoryId(): string {
		return this.props.categoryId;
	}

	get imageUrl(): string | undefined {
		return this.props.imageUrl;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	decrementStock(quantity: number): void {
		if (quantity > this.props.stock) {
			throw new Error("Insufficient stock");
		}
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			price: this.price,
			stock: this.stock,
			categoryId: this.categoryId,
			imageUrl: this.imageUrl,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
