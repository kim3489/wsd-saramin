import swaggerJsdoc from 'swagger-jsdoc';


const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'saramin API',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: 'http://113.198.66.75:19133/api',
                description: 'server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // 라우트 파일에서 Swagger 주석을 읽어옵니다.
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;