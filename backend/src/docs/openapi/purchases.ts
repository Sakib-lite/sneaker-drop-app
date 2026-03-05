/**
 * @openapi
 * /api/purchases:
 *   post:
 *     summary: Complete a purchase (requires active reservation)
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - dropId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 3432621a-80e2-4018-971a-88e6caa0e788
 *               dropId:
 *                 type: string
 *                 example: 4a6c4e7d-8d12-4cea-bfd9-0171758bf81a
 *     responses:
 *       201:
 *         description: Purchase completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     drop:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         price:
 *                           type: string
 *                     price:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *       403:
 *         description: No active reservation found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No active reservation found for this drop
 *       410:
 *         description: Reservation expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Reservation has expired
 */

export {};
