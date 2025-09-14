export interface BorrowerValidationErrors {
  name?: string;
  email?: string;
}

export interface BorrowerFormData {
  name: string;
  email: string;
}

// Email validation utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Individual field validators
export const validateName = (name: string): string => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 100) {
    return 'Name cannot exceed 100 characters';
  }
  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

export const validateEmailField = (email: string): string => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  if (email.length > 254) {
    return 'Email cannot exceed 254 characters';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// Main validation function
export const validateBorrowerForm = (formData: BorrowerFormData): BorrowerValidationErrors => {
  const errors: BorrowerValidationErrors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmailField(formData.email);
  if (emailError) errors.email = emailError;

  return errors;
};

// Helper to check if form is valid
export const isBorrowerFormValid = (errors: BorrowerValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

// Helper to validate a single field
export const validateBorrowerField = (fieldName: keyof BorrowerFormData, value: string): string => {
  switch (fieldName) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmailField(value);
    default:
      return '';
  }
};
