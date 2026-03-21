import mongoose, { Document, Schema } from "mongoose";

export interface IProductDocument extends Document {
	_id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	categoryId: string;
	imageUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
	{
		_id: { type: String },
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		stock: { type: Number, required: true, min: 0, default: 0 },
		categoryId: { type: String, required: true, index: true },
		imageUrl: { type: String },
	},
	{
		timestamps: true,
		_id: false,
	},
);

ProductSchema.index({ name: "text", description: "text" });

export const ProductModel = mongoose.model<IProductDocument>(
	"Product",
	ProductSchema,
);
