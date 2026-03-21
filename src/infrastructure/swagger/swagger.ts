import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Products Service API",
			version: "1.0.0",
			description: "API de produtos do e-commerce",
		},
		servers: [
			{ url: "http://localhost:3002", description: "Development server" },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				Product: {
					type: "object",
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
						price: { type: "number" },
						stock: { type: "number" },
						categoryId: { type: "string" },
						imageUrl: { type: "string" },
						createdAt: { type: "string", format: "date-time" },
						updatedAt: { type: "string", format: "date-time" },
					},
				},
				CreateProductRequest: {
					type: "object",
					required: ["name", "description", "price", "stock", "categoryId"],
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						price: { type: "number" },
						stock: { type: "number" },
						categoryId: { type: "string" },
						imageUrl: { type: "string" },
					},
				},
				UpdateProductRequest: {
					type: "object",
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						price: { type: "number" },
						stock: { type: "number" },
						categoryId: { type: "string" },
						imageUrl: { type: "string" },
					},
				},
			},
		},
		security: [{ bearerAuth: [] }],
		paths: {
			"/products": {
				get: {
					summary: "Listar todos os produtos",
					tags: ["Products"],
					security: [{ bearerAuth: [] }],
					responses: {
						"200": {
							description: "Lista de produtos",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: { $ref: "#/components/schemas/Product" },
									},
								},
							},
						},
					},
				},
				post: {
					summary: "Criar novo produto",
					tags: ["Products"],
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/CreateProductRequest" },
							},
						},
					},
					responses: {
						"201": {
							description: "Produto criado",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Product" },
								},
							},
						},
					},
				},
			},
			"/products/{id}": {
				get: {
					summary: "Obter produto por ID",
					tags: ["Products"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							in: "path",
							name: "id",
							required: true,
							schema: { type: "string" },
						},
					],
					responses: {
						"200": {
							description: "Produto encontrado",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Product" },
								},
							},
						},
						"404": {
							description: "Produto não encontrado",
						},
					},
				},
				put: {
					summary: "Atualizar produto",
					tags: ["Products"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							in: "path",
							name: "id",
							required: true,
							schema: { type: "string" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/UpdateProductRequest" },
							},
						},
					},
					responses: {
						"200": {
							description: "Produto atualizado",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Product" },
								},
							},
						},
						"404": {
							description: "Produto não encontrado",
						},
					},
				},
				delete: {
					summary: "Deletar produto",
					tags: ["Products"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							in: "path",
							name: "id",
							required: true,
							schema: { type: "string" },
						},
					],
					responses: {
						"204": {
							description: "Produto deletado",
						},
						"404": {
							description: "Produto não encontrado",
						},
					},
				},
			},
		},
	},
	apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
