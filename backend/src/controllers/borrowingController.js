const Borrowing = require("../models/borrowingModel");
const Book = require("../models/bookModel");
const Borrower = require("../models/borrowerModel");

class BorrowingController {
  // Get all borrowings
  static async getAllBorrowings(req, res) {
    try {
      await Borrowing.updateOverdueStatus(); // Update overdue status first
      const borrowings = await Borrowing.getAll();
      res.json(borrowings);
    } catch (error) {
      console.error('Error getting borrowings:', error);
      res.status(500).json({ message: "Error retrieving borrowings" });
    }
  }

  // Checkout a book
  static async checkoutBook(req, res) {
    try {
      const { book_id, borrower_id, due_date } = req.body;

      // Validate required fields
      if (!book_id || !borrower_id || !due_date) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate due date is in the future
      const dueDate = new Date(due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (dueDate <= today) {
        return res
          .status(400)
          .json({ message: "Due date must be in the future" });
      }
      // Check if book exists and is available
      const book = await Book.findById(book_id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.quantity < 1) {
        return res.status(400).json({ message: "Book is not available" });
      }

      // Check if borrower exists
      const borrower = await Borrower.findById(borrower_id);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }

      // Create borrowing record
      const borrowingId = await Borrowing.create({
        book_id,
        borrower_id,
        due_date: new Date(due_date),
      });

      // Update book quantity
      await Book.updateQuantity(book_id, -1);

      res.status(201).json({
        message: "Book checked out successfully",
        borrowingId,
      });
    } catch (error) {
      res.status(500).json({ message: "Error checking out book" });
    }
  }

  // Return a book
  static async returnBook(req, res) {
    try {
      const borrowing = await Borrowing.findById(req.params.id);
      if (!borrowing) {
        return res.status(404).json({ message: "Borrowing record not found" });
      }
      if (borrowing.status === "RETURNED") {
        return res.status(400).json({ message: "Book already returned" });
      }

      await Borrowing.returnBook(req.params.id);
      await Book.updateQuantity(borrowing.book_id, 1);

      res.json({ message: "Book returned successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error returning book" });
    }
  }

  // Get all overdue books
  static async getOverdueBooks(req, res) {
    try {
      await Borrowing.updateOverdueStatus(); // Update status first
      const overdueBooks = await Borrowing.getOverdueBooks();
      res.json(overdueBooks);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving overdue books" });
    }
  }

  // Get overdue books for a specific borrower
  static async getBorrowerOverdueBooks(req, res) {
    try {
      const { borrowerId } = req.params;
      if (!borrowerId || isNaN(borrowerId)) {
        return res.status(400).json({ message: "Valid borrower ID is required" });
      }
      
      await Borrowing.updateOverdueStatus(); // Update status first
      const overdueBooks = await Borrowing.getBorrowerOverdueBooks(borrowerId);
      res.json(overdueBooks);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving borrower's overdue books" });
    }
  }

  // Get borrowed books by borrower
  static async getBorrowedBooksByBorrower(req, res) {
    try {
      const borrowerId = req.params.id;

      // Validate borrower ID
      if (!borrowerId || isNaN(borrowerId)) {
        return res.status(400).json({ message: "Valid borrower ID is required" });
      }

      // Check if borrower exists
      const borrower = await Borrower.findById(borrowerId);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }

      // Get all borrowed books for this borrower
      const borrowedBooks = await Borrowing.findByBorrowerId(borrowerId);
      
      res.json({
        borrower: {
          id: borrower.id,
          name: borrower.name,
          email: borrower.email
        },
        borrowedBooks: borrowedBooks,
        totalBooks: borrowedBooks.length
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving borrowed books" });
    }
  }
}

module.exports = BorrowingController;
