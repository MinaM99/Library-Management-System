import { Book } from './book';
import { Borrower } from './borrower';

export interface Borrowing {
  id: number;
  bookId: number;
  borrowerId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  book: Book;
  borrower: Borrower;
}

export interface BorrowingRequest {
  book_id: number;
  borrower_id: number;
  due_date: string;
}
