import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { createProduct } from "../../application/commands/CreateProductCommand";
import { deleteProduct } from "../../application/commands/DeleteProductCommand";
import { updateProduct } from "../../application/commands/UpdateProductCommand";
import { getProductById } from "../../application/queries/GetProductByIdQuery";
import { listProducts } from "../../application/queries/ListProductsQuery";
import {
	CreateProductSchema,
	UpdateProductSchema,
} from "../../infrastructure/validation/ProductValidator";

export const productController = {
	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const input = CreateProductSchema.parse(req.body);
			const result = await createProduct(input);

			res.status(201).json(result.product.toJSON());
		} catch (error) {
			if (error instanceof ZodError) {
				res
					.status(400)
					.json({ error: "Validation error", details: error.errors });
				return;
			}
			next(error);
		}
	},

	async getById(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(400).json({ error: "Product ID is required" });
				return;
			}
			const product = await getProductById(id);

			if (!product) {
				res.status(404).json({ error: "Product not found" });
				return;
			}

			res.json(product.toJSON());
		} catch (error) {
			next(error);
		}
	},

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { categoryId, search } = req.query;
			const filters = {
				categoryId: categoryId as string | undefined,
				search: search as string | undefined,
			};

			const products = await listProducts(filters);

			res.json(products.map((p) => p.toJSON()));
		} catch (error) {
			next(error);
		}
	},

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(400).json({ error: "Product ID is required" });
				return;
			}
			const input = UpdateProductSchema.parse(req.body);
			const result = await updateProduct(id, input);

			res.json(result.product.toJSON());
		} catch (error) {
			if (error instanceof ZodError) {
				res
					.status(400)
					.json({ error: "Validation error", details: error.errors });
				return;
			}
			if (error instanceof Error && error.message === "Product not found") {
				res.status(404).json({ error: error.message });
				return;
			}
			next(error);
		}
	},

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(400).json({ error: "Product ID is required" });
				return;
			}
			await deleteProduct(id);

			res.status(204).send();
		} catch (error) {
			if (error instanceof Error && error.message === "Product not found") {
				res.status(404).json({ error: error.message });
				return;
			}
			next(error);
		}
	},
};
