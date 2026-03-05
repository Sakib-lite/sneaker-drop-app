import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sneaker Drop API',
      version: '1.0.0',
      description: 'API documentation for Limited Edition Sneaker Drop real-time inventory system',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        }
      }
    },
  },
  apis: ['./src/docs/openapi/*.ts'],
};

export const specs = swaggerJsdoc(options);
