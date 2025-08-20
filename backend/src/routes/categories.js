const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all main categories (parent_id = 0) from the database
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name FROM category WHERE parent_id = 0'
        );
        
        res.json(rows);
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
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a specific category by its ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT id, name FROM category WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json(rows[0]);
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
 * /api/categories/{id}/subcategories:
 *   get:
 *     summary: Get subcategories
 *     description: Retrieve all subcategories for a specific parent category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parent category ID
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/subcategories', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT id, name FROM category WHERE parent_id = ?',
            [id]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

module.exports = router; 