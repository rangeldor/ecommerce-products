import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryModel, ICategoryDocument } from "../schemas/CategorySchema";

export class MongoCategoryRepository implements ICategoryRepository {
	async create(category: Category): Promise<Category> {
		const doc = await CategoryModel.create({
			_id: category.id,
			name: category.name,
			slug: category.slug,
		});
		return this.toDomain(doc);
	}

	async findById(id: string): Promise<Category | null> {
		const doc = await CategoryModel.findById(id);
		return doc ? this.toDomain(doc) : null;
	}

	async findBySlug(slug: string): Promise<Category | null> {
		const doc = await CategoryModel.findOne({ slug });
		return doc ? this.toDomain(doc) : null;
	}

	async findAll(): Promise<Category[]> {
		const docs = await CategoryModel.find();
		return docs.map(this.toDomain);
	}

	async update(category: Category): Promise<Category> {
		const doc = await CategoryModel.findByIdAndUpdate(
			category.id,
			{ name: category.name, slug: category.slug },
			{ new: true },
		);
		if (!doc) {
			throw new Error("Category not found");
		}
		return this.toDomain(doc);
	}

	async delete(id: string): Promise<void> {
		await CategoryModel.findByIdAndDelete(id);
	}

	private toDomain(doc: ICategoryDocument): Category {
		return Category.create(doc.name, doc.slug, doc._id.toString());
	}
}
