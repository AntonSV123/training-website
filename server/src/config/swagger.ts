// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Кенгуру',
        version: '1.0.0',
        description: 'Документація API для Сайту про Кенгуру',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення роутерів API та операцій з ними
    paths: {
        '/api/kangaroos': {
            // GET запит для отримання всіх Кенгуру
            get: {
                summary: 'Отримати всіх Кенгуру',
                responses: {
                    '200': {
                        description: 'Список всіх Кенгуру',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Kangaroo' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового Кенгуру
            post: {
                summary: 'Створити нового Кенгуру',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Kangaroo' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт Кенгуру",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Kangaroo' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного Кенгуру за ID
        '/api/kangaroos/{id}': {
            // GET запит для отримання Кенгуру за ID
            get: {
                summary: 'Отримати Кенгуру за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Кенгуру',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт Кенгуру",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Kangaroo' },
                            },
                        },
                    },
                    '404': { description: 'Кенгуру не знайдено' },
                },
            },

            // PUT запит для повного оновлення Кенгуру за ID
            put: {
                summary: 'Повністю оновити Кенгуру',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Кенгуру',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Kangaroo' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт Кенгуру",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Kangaroo' },
                            },
                        },
                    },
                    '404': { description: 'Кенгуру не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення Кенгуру за ID
            patch: {
                summary: 'Частково оновити Кенгуру',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Кенгуру',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Kangaroo' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт Кенгуру",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Kangaroo' },
                            },
                        },
                    },
                    '404': { description: 'Кенгуру не знайдено' },
                },
            },
            // DELETE запит для видалення даних про Кенгуру за ID
            delete: {
                summary: 'Видалити дані про Кенгуру',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Кенгуру',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Кенгуру не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Кенгуру
            Kangaroo: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я Кенгуру",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік Кенгуру у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота Кенгуру в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага Кенгуру в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать Кенгуру',
                    },
                    description: {
                        type: 'string',
                        description: "Опис Кенгуру (необов'язкове поле)",
                    },
                    pouchSize: {
                        type: 'string',
                        pouchSize: 'Pозмір сумки для носіння дитинча, см3.',
                    },
                },
            },
        },
    },
};
