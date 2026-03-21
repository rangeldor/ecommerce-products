import mongoose from "mongoose";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
	if (isConnected) {
		return;
	}

	const uri =
		process.env.MONGODB_URI || "mongodb://localhost:27018/products_db";

	try {
		await mongoose.connect(uri);
		isConnected = true;
		console.log("✅ MongoDB connected successfully");
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error);
		throw error;
	}
}

export async function disconnectDatabase(): Promise<void> {
	if (!isConnected) {
		return;
	}

	await mongoose.disconnect();
	isConnected = false;
	console.log("📦 MongoDB disconnected");
}

mongoose.connection.on("error", (err) => {
	console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
	isConnected = false;
});
