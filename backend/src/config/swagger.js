const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'API documentation for Library Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        Book: {
          type: 'object',
          required: ['title', 'author', 'ISBN', 'quantity', 'shelf_location'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the book'
            },
            title: {
              type: 'string',
              description: 'The title of the book'
            },
            author: {
              type: 'string',
              description: 'The author of the book'
            },
            ISBN: {
              type: 'string',
              description: 'The ISBN of the book'
            },
            quantity: {
              type: 'integer',
              description: 'Available quantity of the book'
            },
            shelf_location: {
              type: 'string',
              description: 'Physical location of the book in the library'
            }
          }
        },
        BookUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the book'
            },
            author: {
              type: 'string',
              description: 'The author of the book'
            },
            ISBN: {
              type: 'string',
              description: 'The ISBN of the book'
            },
            quantity: {
              type: 'integer',
              description: 'Available quantity of the book'
            },
            shelf_location: {
              type: 'string',
              description: 'Physical location of the book in the library'
            }
          }
        },
        Borrower: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the borrower'
            },
            name: {
              type: 'string',
              description: 'The name of the borrower'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email address of the borrower'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the borrower was created'
            }
          }
        },
        BorrowerUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the borrower'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email address of the borrower'
            }
          }
        },
        Borrowing: {
          type: 'object',
          required: ['book_id', 'borrower_id', 'due_date'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the borrowing record'
            },
            book_id: {
              type: 'integer',
              description: 'The ID of the borrowed book'
            },
            borrower_id: {
              type: 'integer',
              description: 'The ID of the borrower'
            },
            borrow_date: {
              type: 'string',
              format: 'date-time',
              description: 'The date when the book was borrowed'
            },
            due_date: {
              type: 'string',
              format: 'date',
              description: 'The date when the book should be returned'
            },
            return_date: {
              type: 'string',
              format: 'date-time',
              description: 'The date when the book was returned (null if not returned)'
            },
            status: {
              type: 'string',
              enum: ['BORROWED', 'RETURNED'],
              description: 'The status of the borrowing'
            }
          }
        },
        BorrowingDetails: {
          type: 'object',
          properties: {
            borrowing_id: {
              type: 'integer',
              description: 'The ID of the borrowing record'
            },
            book_id: {
              type: 'integer',
              description: 'The ID of the book'
            },
            book_title: {
              type: 'string',
              description: 'The title of the book'
            },
            borrower_id: {
              type: 'integer',
              description: 'The ID of the borrower'
            },
            borrower_name: {
              type: 'string',
              description: 'The name of the borrower'
            },
            borrow_date: {
              type: 'string',
              format: 'date-time',
              description: 'The date when the book was borrowed'
            },
            due_date: {
              type: 'string',
              format: 'date',
              description: 'The date when the book should be returned'
            },
            days_overdue: {
              type: 'integer',
              description: 'Number of days the book is overdue (if applicable)'
            }
          }
        },
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email address for login'
            },
            password: {
              type: 'string',
              description: 'The password for login (will be hashed)'
            },
            role: {
              type: 'string',
              enum: ['admin', 'librarian', 'user'],
              description: 'The role of the user'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token for authentication'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'User ID'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Email address'
                },
                role: {
                  type: 'string',
                  description: 'User role'
                }
              }
            }
          }
        },
        AnalyticsReport: {
          type: 'object',
          properties: {
            total_borrowings: {
              type: 'integer',
              description: 'Total number of borrowings in the period'
            },
            active_borrowings: {
              type: 'integer',
              description: 'Number of active borrowings'
            },
            overdue_borrowings: {
              type: 'integer',
              description: 'Number of overdue borrowings'
            },
            borrowings_data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BorrowingDetails'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
        basicAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and user management endpoints'
      },
      {
        name: 'Books',
        description: 'Book management endpoints'
      },
      {
        name: 'Borrowers',
        description: 'Borrower management endpoints'
      },
      {
        name: 'Borrowings',
        description: 'Book borrowing and return management endpoints'
      },
      {
        name: 'Analytics',
        description: 'Analytics and reporting endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
