const Book = require("../models/bookModel");
const { validateISBN } = require("../utils/validation");

class BookController {
  // Add a new book
  static async addBook(req, res) {
    try {
      const { title, author, ISBN, quantity, shelf_location } = req.body;

      // Validate required fields
      if (!title || !author || !ISBN || !shelf_location) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate ISBN format
      if (!validateISBN(ISBN)) {
        return res.status(400).json({ message: "Invalid ISBN format" });
      }

      const bookId = await Book.create({
        title,
        author,
        ISBN,
        quantity: quantity || 1,
        shelf_location,
      });

      res.status(201).json({
        message: "Book added successfully",
        bookId,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "ISBN must be unique" });
      }
      res.status(500).json({ message: "Error adding book" });
    }
  }

  // Get all books
  static async getAllBooks(req, res) {
    try {
      const books = await Book.findAll();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books" });
    }
  }

  // Get a specific book
  static async getBook(req, res) {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      console.error('Error in getBook:', error);
      res.status(500).json({ message: "Error retrieving book" });
    }
  }

  // Update a book
  static async updateBook(req, res) {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const bookData = {};
      if (req.body.title) bookData.title = req.body.title;
      if (req.body.author) bookData.author = req.body.author;
      if (req.body.ISBN) bookData.ISBN = req.body.ISBN;
      if (req.body.quantity) bookData.quantity = req.body.quantity;
      if (req.body.shelf_location) bookData.shelf_location = req.body.shelf_location;

      if (Object.keys(bookData).length === 0) {
        return res
          .status(400)
          .json({
            message: "Please provide at least one book parameter to update",
          });
      }

      const result = await Book.update(bookId, bookData);
      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json({ message: "Book updated successfully" });
    } catch (error) {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating book" });
    }
  }

  // Delete a book
  static async deleteBook(req, res) {
    try {
      const deleted = await Book.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting book" });
    }
  }

  // Search books
  static async searchBooks(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const books = await Book.search(query);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error searching books" });
    }
  }
}

module.exports = BookController;
