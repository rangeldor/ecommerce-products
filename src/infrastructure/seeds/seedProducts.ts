import { faker } from "@faker-js/faker";
import { MongoProductRepository } from "../persistence/repositories/MongoProductRepository";
import { MongoCategoryRepository } from "../persistence/repositories/MongoCategoryRepository";

const productRepository = new MongoProductRepository();
const categoryRepository = new MongoCategoryRepository();

const CATEGORIES = [
	{ id: "cat-electronics", name: "Eletrônicos", slug: "eletronicos" },
	{ id: "cat-clothing", name: "Roupas", slug: "roupas" },
	{ id: "cat-books", name: "Livros", slug: "livros" },
	{ id: "cat-home", name: "Casa e Jardim", slug: "casa-jardim" },
	{ id: "cat-sports", name: "Esportes", slug: "esportes" },
];

export async function seedProducts(): Promise<void> {
	console.log("🌱 Seeding products...");

	for (const cat of CATEGORIES) {
		const existingCat = await categoryRepository.findById(cat.id);
		if (!existingCat) {
			await categoryRepository.create({
				id: cat.id,
				name: cat.name,
				slug: cat.slug,
				createdAt: new Date(),
			} as any);
			console.log(`✅ Category created: ${cat.name}`);
		}
	}

	const existingProducts = await productRepository.findAll();
	if (existingProducts.length > 0) {
		console.log(`✅ Products already exist (${existingProducts.length})`);
		return;
	}

	const productsToCreate = [];
	for (let i = 0; i < 20; i++) {
		const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]!;
		productsToCreate.push({
			id: faker.string.uuid(),
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: parseFloat(faker.commerce.price({ min: 10, max: 5000, dec: 2 })),
			stock: faker.number.int({ min: 0, max: 100 }),
			categoryId: category.id,
			imageUrl: faker.image.url(),
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	for (const product of productsToCreate) {
		await productRepository.create(product as any);
	}

	console.log(`✅ Created ${productsToCreate.length} products`);
}
