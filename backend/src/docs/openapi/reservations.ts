/**
 * @openapi
 * /api/reservations:
 *   post:
 *     summary: Create a reservation (atomic operation)
 *     tags: [Reservations]
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
 *         description: Reservation created successfully
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
 *                     dropId:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       example: 2026-03-04T12:01:30Z
 *                     drop:
 *                       type: object
 *       409:
 *         description: Already have an active reservation
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
 *                   example: You already have an active reservation for this drop
 *       410:
 *         description: Out of stock
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
 *                   example: Out of stock
 */

/**
 * @openapi
 * /api/reservations/my-reservations:
 *   get:
 *     summary: Get user's active reservations
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 3432621a-80e2-4018-971a-88e6caa0e788
 *     responses:
 *       200:
 *         description: User reservations
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
 *                       drop:
 *                         type: object
 *                       expiresAt:
 *                         type: string
 *                       timeRemaining:
 *                         type: number
 *                         example: 45
 */

/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 3432621a-80e2-4018-971a-88e6caa0e788
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Reservation not found
 */

export {};
