import { randomUUID } from "crypto";

export interface CategoryProps {
	readonly id: string;
	readonly name: string;
	readonly slug: string;
	readonly createdAt: Date;
}

export class Category {
	private constructor(private readonly props: CategoryProps) {}

	static create(name: string, slug?: string, id?: string): Category {
		const generatedSlug = slug ?? name.toLowerCase().replace(/\s+/g, "-");
		return new Category({
			id: id ?? randomUUID(),
			name,
			slug: generatedSlug,
			createdAt: new Date(),
		});
	}

	get id(): string {
		return this.props.id;
	}

	get name(): string {
		return this.props.name;
	}

	get slug(): string {
		return this.props.slug;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			slug: this.slug,
			createdAt: this.createdAt,
		};
	}
}
