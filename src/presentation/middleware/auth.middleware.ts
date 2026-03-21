import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";

export interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		email: string;
	};
}

export function authMiddleware(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({ error: "Authorization header required" });
		return;
	}

	const [bearer, token] = authHeader.split(" ");

	if (bearer !== "Bearer" || !token) {
		res
			.status(401)
			.json({ error: "Invalid authorization format. Use: Bearer <token>" });
		return;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {
			userId: string;
			email: string;
		};
		req.user = decoded;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			res.status(401).json({ error: "Token expired" });
			return;
		}
		res.status(401).json({ error: "Invalid token" });
	}
}
