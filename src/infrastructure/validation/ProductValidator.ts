import { z } from "zod";

export const CreateProductSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	description: z.string().min(1, "Description is required"),
	price: z.number().positive("Price must be positive"),
	stock: z.number().int().min(0, "Stock must be non-negative"),
	categoryId: z.string().min(1, "Category ID is required"),
	imageUrl: z.string().url().optional(),
});

export const UpdateProductSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	description: z.string().min(1).optional(),
	price: z.number().positive().optional(),
	stock: z.number().int().min(0).optional(),
	categoryId: z.string().min(1).optional(),
	imageUrl: z.string().url().optional(),
});

export const CreateCategorySchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	slug: z.string().min(1).max(100).optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
