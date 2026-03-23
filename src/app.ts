import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { errorMiddleware } from "./presentation/middleware/error.middleware";
import { productRoutes } from "./presentation/routes/product.routes";

export function createApp(): Express {
	const app = express();

	const allowedOrigins = (
		process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:3005,http://localhost:3006,http://localhost:3007"
	).split(",");

	app.use(
		cors({
			origin: allowedOrigins,
			credentials: true,
		}),
	);

	app.use(express.json());

	app.get("/health", (_, res: Response) => {
		res.json({ status: "ok", service: "products-service" });
	});

	app.use("/products", productRoutes);

	app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
		errorMiddleware(err, _req, res, _next);
	});

	return app;
}

export const app = createApp();
