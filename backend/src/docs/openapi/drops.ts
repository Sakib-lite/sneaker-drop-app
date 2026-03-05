/**
 * @openapi
 * /api/drops:
 *   post:
 *     summary: Create a new sneaker drop
 *     tags: [Drops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - totalStock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Air Jordan 1 Retro High
 *               description:
 *                 type: string
 *                 example: Chicago colorway limited edition
 *               price:
 *                 type: number
 *                 example: 250.00
 *               totalStock:
 *                 type: integer
 *                 example: 100
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/sneaker.jpg
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-05T10:00:00Z
 *     responses:
 *       201:
 *         description: Drop created successfully
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
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     totalStock:
 *                       type: integer
 *                     availableStock:
 *                       type: integer
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /api/drops:
 *   get:
 *     summary: Get all drops with top 3 recent purchasers
 *     tags: [Drops]
 *     responses:
 *       200:
 *         description: List of all drops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: Air Jordan 1
 *                       price:
 *                         type: number
 *                         example: 250.00
 *                       totalStock:
 *                         type: integer
 *                         example: 100
 *                       availableStock:
 *                         type: integer
 *                         example: 47
 *                       recentPurchasers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             username:
 *                               type: string
 *                               example: john_doe
 *                             purchasedAt:
 *                               type: string
 *                               example: 2026-03-04T12:00:00Z
 */

/**
 * @openapi
 * /api/drops/{id}:
 *   get:
 *     summary: Get drop by ID
 *     tags: [Drops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Drop details
 *       404:
 *         description: Drop not found
 */

export {};
