const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API quan ly don hang",
      contact: { name: "Dev Team", email: "dev@example.com" },
    },
    servers: [
      { url: "http://localhost:3002", description: "Order Service" },
      { url: "http://localhost:3000", description: "API Gateway" },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        OrderItemInput: {
          type: "object",
          required: ["productId", "productName", "price", "quantity"],
          properties: {
            productId: { type: "integer", example: 1 },
            productName: { type: "string", example: "iPhone 15 Pro" },
            price: { type: "number", example: 27990000 },
            quantity: { type: "integer", minimum: 1, example: 2 },
          },
        },
        OrderItem: {
          allOf: [
            { $ref: "#/components/schemas/OrderItemInput" },
            {
              type: "object",
              properties: {
                subtotal: { type: "number", example: 55980000 },
              },
            },
          ],
        },
        ShippingAddress: {
          type: "object",
          properties: {
            street: { type: "string", example: "123 Nguyen Trai" },
            city: { type: "string", example: "Ho Chi Minh" },
            district: { type: "string", example: "Quan 1" },
          },
        },
        CreateOrderRequest: {
          type: "object",
          required: ["customerId", "customerName", "customerEmail", "items"],
          properties: {
            customerId: { type: "integer", example: 1 },
            customerName: { type: "string", example: "Nguyen Van A" },
            customerEmail: { type: "string", example: "a@example.com" },
            items: {
              type: "array",
              minItems: 1,
              items: { $ref: "#/components/schemas/OrderItemInput" },
            },
            shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
            note: { type: "string", example: "Giao hang gio hanh chinh" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string", example: "66195cc6a4a4a64e0fd80281" },
            _id: { type: "string", example: "66195cc6a4a4a64e0fd80281" },
            orderCode: { type: "string", example: "ORD-20260411-0001" },
            customerId: { type: "integer", example: 1 },
            customerName: { type: "string", example: "Nguyen Van A" },
            customerEmail: { type: "string", example: "a@example.com" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            totalAmount: { type: "number", example: 55980000 },
            totalItems: { type: "integer", example: 2 },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
              example: "pending",
            },
            shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
            note: { type: "string", example: "Giao hang gio hanh chinh" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
              example: "confirmed",
            },
          },
        },
        PaginatedOrders: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer", example: 20 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                totalPages: { type: "integer", example: 2 },
              },
            },
          },
        },
        OrderResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Order" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Du lieu khong hop le" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
