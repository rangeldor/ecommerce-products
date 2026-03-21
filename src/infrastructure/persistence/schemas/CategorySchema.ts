import mongoose, { Document, Schema } from "mongoose";

export interface ICategoryDocument extends Document {
	_id: string;
	name: string;
	slug: string;
	createdAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
	{
		_id: { type: String },
		name: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true },
	},
	{
		timestamps: true,
		_id: false,
	},
);

CategorySchema.index({ slug: 1 }, { unique: true });

export const CategoryModel = mongoose.model<ICategoryDocument>(
	"Category",
	CategorySchema,
);
