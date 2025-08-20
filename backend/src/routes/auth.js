const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { generateToken, verifyToken } = require('../middleware/auth');
const PasswordValidator = require('../utils/password-validator');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email
 *               password:
 *                 type: string
 *                 description: Password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password, req.body);
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Query user from database
        const [users] = await pool.execute(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Validate password using PHP-compatible validator
        const isValidPassword = PasswordValidator.checkPassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user data (without password)
        const userResponse = {
            id: user.id,
            email: user.email,
            role: user.role || 'user'
        };

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get current authenticated user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }

        // Get user from database
        const [users] = await pool.execute(
            'SELECT id, email, user_group_id AS role FROM user WHERE id = ?',
            [payload.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const user = users[0];

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout current user (client should discard token)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/logout', (req, res) => {
    // JWT tokens are stateless, so we just return success
    // The client should discard the token
    res.json({
        message: 'Logout successful'
    });
});

/**
 * @swagger
 * /api/auth/validate:
 *   post:
 *     summary: Validate token
 *     description: Validate if a JWT token is still valid
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token to validate
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Token is invalid
 */
router.post('/validate', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'Token is required'
            });
        }

        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({
                valid: false,
                error: 'Invalid token'
            });
        }

        // Get user from database to ensure user still exists
        const [users] = await pool.execute(
            'SELECT id, email, user_group_id AS role FROM user WHERE id = ?',
            [payload.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                valid: false,
                error: 'User not found'
            });
        }

        const user = users[0];

        res.json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router; 