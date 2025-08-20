const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Admin Panel API',
            version: '1.0.0',
            description: 'Express backend API for admin panel with MySQL integration',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: process.env.BACKEND_URL || 'http://localhost:3002',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Product ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Product name'
                        },
                        description: {
                            type: 'string',
                            description: 'Product description'
                        },
                        price: {
                            type: 'number',
                            description: 'Product price'
                        },
                        category: {
                            type: 'string',
                            description: 'Product category'
                        },
                        stock: {
                            type: 'integer',
                            description: 'Product stock quantity'
                        },
                        imageUrl: {
                            type: 'string',
                            description: 'Product image URL'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation date'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update date'
                        },
                        is_active: {
                            type: 'boolean',
                            description: 'Product active status'
                        },
                        is_enabled: {
                            type: 'boolean',
                            description: 'Product enabled status'
                        },
                        parent_id: {
                            type: 'integer',
                            description: 'Parent product ID'
                        }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Category ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Category name'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'User ID'
                        },
                        username: {
                            type: 'string',
                            description: 'Username'
                        },
                        role: {
                            type: 'string',
                            description: 'User role'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Username'
                        },
                        password: {
                            type: 'string',
                            description: 'Password'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Success message'
                        },
                        token: {
                            type: 'string',
                            description: 'JWT token'
                        },
                        user: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        },
                        details: {
                            type: 'string',
                            description: 'Error details'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 