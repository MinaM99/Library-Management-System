const Book = require('../models/bookModel');
const db = require('../config/database');

// Mock the database module
jest.mock('../config/database');

describe('Book Model', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new book successfully', async () => {
            const mockBook = {
                title: 'Test Book',
                author: 'Test Author',
                ISBN: '1234567890',
                quantity: 1,
                shelf_location: 'A1'
            };

            const mockResult = [{ insertId: 1 }];
            db.query.mockResolvedValue(mockResult);

            const result = await Book.create(mockBook);

            expect(result).toBe(1);
            expect(db.query).toHaveBeenCalledWith(
                expect.any(String),
                [mockBook.title, mockBook.author, mockBook.ISBN, mockBook.quantity, mockBook.shelf_location]
            );
        });
    });

    describe('findById', () => {
        it('should find a book by id', async () => {
            const mockBook = {
                id: 1,
                title: 'Test Book',
                author: 'Test Author'
            };

            db.query.mockResolvedValue([[mockBook]]);

            const result = await Book.findById(1);

            expect(result).toEqual(mockBook);
            expect(db.query).toHaveBeenCalledWith(
                expect.any(String),
                [1]
            );
        });

        it('should return undefined for non-existent book', async () => {
            db.query.mockResolvedValue([[]]);

            const result = await Book.findById(999);

            expect(result).toBeUndefined();
        });
    });

    describe('search', () => {
        it('should search books by query', async () => {
            const mockBooks = [
                { id: 1, title: 'Test Book 1' },
                { id: 2, title: 'Test Book 2' }
            ];

            db.query.mockResolvedValue([mockBooks]);

            const result = await Book.search('Test');

            expect(result).toEqual(mockBooks);
            expect(db.query).toHaveBeenCalledWith(
                expect.any(String),
                ['%Test%', '%Test%', '%Test%']
            );
        });
    });
});
