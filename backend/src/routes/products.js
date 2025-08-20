const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products from the database with pagination (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 1000 } = req.query;
        const offset = (page - 1) * limit;
        
        // Use the authenticated user's ID
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            'SELECT * FROM classified WHERE user_id = ? LIMIT ? OFFSET ?',
            [userId, parseInt(limit), offset]
        );
        
        // Map MySQL fields to frontend product fields
        const mappedProducts = rows.map(item => ({
            id: item.id?.toString() ?? '',
            name: item.name ?? '',
            description: item.description ?? '',
            price: item.price ?? 0,
            category: item.main_category_name || item.main_subcategory_name || 'Egyéb',
            stock: 1, // Default stock value
            imageUrl: Array.isArray(item.images) ? 
                (item.images[0] ? `/images/${item.images[0]}` : '') : 
                (item.main_image ? `/images/${item.main_image}` : ''),
            createdAt: item.created_at ?? '',
            updatedAt: item.modified_at ?? '',
            is_active: item.is_active ?? true,
            is_enabled: item.is_enabled ?? true,
            parent_id: item.parent_id ?? 0,
        }));

        res.json(mappedProducts);
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product by its ID (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            'SELECT * FROM classified WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const item = rows[0];
        const product = {
            id: item.id?.toString() ?? '',
            name: item.name ?? '',
            description: item.description ?? '',
            price: item.price ?? 0,
            category: item.main_category_name || item.main_subcategory_name || 'Egyéb',
            stock: 1,
            imageUrl: Array.isArray(item.images) ? 
                (item.images[0] ? `/images/${item.images[0]}` : '') : 
                (item.main_image ? `/images/${item.main_image}` : ''),
            createdAt: item.created_at ?? '',
            updatedAt: item.modified_at ?? '',
            is_active: item.is_active ?? true,
            is_enabled: item.is_enabled ?? true,
            parent_id: item.parent_id ?? 0,
        };

        res.json(product);
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product status
 *     description: Update the active status of a product (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 description: Product active status
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const userId = req.user.id;
        
        if (typeof is_active !== 'boolean' && typeof is_active !== 'number') {
            return res.status(400).json({ error: 'Invalid is_active value' });
        }
        
        await pool.execute(
            'UPDATE classified SET is_active = ? WHERE id = ? AND user_id = ?',
            [is_active ? 1 : 0, id, userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Delete a product by its ID (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        await pool.execute(
            'DELETE FROM classified WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

module.exports = router; 