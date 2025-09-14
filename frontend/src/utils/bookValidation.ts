export interface ValidationErrors {
  title?: string;
  author?: string;
  ISBN?: string;
  quantity?: string;
  shelf_location?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  ISBN: string;
  quantity: number;
  shelf_location: string;
}

// ISBN validation utility
export const validateISBN = (isbn: string): boolean => {
  // Basic ISBN validation (supports both ISBN-10 and ISBN-13)
  const cleanISBN = isbn.replace(/[- ]/g, '');
  const isbn10Regex = /^(\d{9}[\dX])$/;
  const isbn13Regex = /^(\d{13})$/;
  return isbn10Regex.test(cleanISBN) || isbn13Regex.test(cleanISBN);
};

// Individual field validators
export const validateTitle = (title: string): string => {
  if (!title || title.trim().length < 2) {
    return 'Title must be at least 2 characters long';
  }
  if (title.trim().length > 200) {
    return 'Title cannot exceed 200 characters';
  }
  return '';
};

export const validateAuthor = (author: string): string => {
  if (!author || author.trim().length < 2) {
    return 'Author name must be at least 2 characters long';
  }
  if (author.trim().length > 100) {
    return 'Author name cannot exceed 100 characters';
  }
  return '';
};

export const validateISBNField = (isbn: string): string => {
  if (!isbn || isbn.trim().length === 0) {
    return 'ISBN is required';
  }
  if (!validateISBN(isbn)) {
    return 'Please enter a valid ISBN-10 or ISBN-13';
  }
  return '';
};

export const validateQuantity = (quantity: number): string => {
  if (quantity < 0 || !Number.isInteger(quantity)) {
    return 'Quantity must be a non-negative integer';
  }
  if (quantity > 10000) {
    return 'Quantity cannot exceed 10,000';
  }
  return '';
};

export const validateShelfLocation = (shelfLocation: string): string => {
  if (!shelfLocation || shelfLocation.trim().length === 0) {
    return 'Shelf location is required';
  }
  if (shelfLocation.trim().length > 50) {
    return 'Shelf location cannot exceed 50 characters';
  }
  return '';
};

// Main validation function
export const validateBookForm = (formData: BookFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError = validateTitle(formData.title);
  if (titleError) errors.title = titleError;

  const authorError = validateAuthor(formData.author);
  if (authorError) errors.author = authorError;

  const isbnError = validateISBNField(formData.ISBN);
  if (isbnError) errors.ISBN = isbnError;

  const quantityError = validateQuantity(formData.quantity);
  if (quantityError) errors.quantity = quantityError;

  const shelfError = validateShelfLocation(formData.shelf_location);
  if (shelfError) errors.shelf_location = shelfError;

  return errors;
};

// Helper to check if form is valid
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

// Helper to validate a single field
export const validateField = (fieldName: keyof BookFormData, value: string | number): string => {
  switch (fieldName) {
    case 'title':
      return validateTitle(value as string);
    case 'author':
      return validateAuthor(value as string);
    case 'ISBN':
      return validateISBNField(value as string);
    case 'quantity':
      return validateQuantity(value as number);
    case 'shelf_location':
      return validateShelfLocation(value as string);
    default:
      return '';
  }
};
