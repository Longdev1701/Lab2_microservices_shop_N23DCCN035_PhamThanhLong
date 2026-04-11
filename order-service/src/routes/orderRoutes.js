const router = require("express").Router();
const {
  createOrder,
  getOrdersByCustomer,
  updateOrderStatus,
} = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Quan ly don hang
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tao don hang moi
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateOrderRequest"
 *     responses:
 *       201:
 *         description: Tao don hang thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 *       401:
 *         description: Thieu hoac sai Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       422:
 *         description: Du lieu don hang khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", createOrder);

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Lay danh sach don hang cua customer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID customer tu Auth Service
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: So trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: So ban ghi moi trang
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled]
 *         description: Loc theo trang thai don hang
 *     responses:
 *       200:
 *         description: Thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginatedOrders"
 *       401:
 *         description: Thieu hoac sai Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/customer/:customerId", getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cap nhat trang thai don hang
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId cua don hang
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateOrderStatusRequest"
 *     responses:
 *       200:
 *         description: Cap nhat thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 *       400:
 *         description: ID hoac status khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Thieu hoac sai Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Khong tim thay don hang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id/status", updateOrderStatus);

module.exports = router;
