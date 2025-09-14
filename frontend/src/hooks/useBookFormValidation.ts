import { useState, useCallback } from 'react';
import { ValidationErrors, BookFormData, validateBookForm, validateField, isFormValid } from '@/utils/bookValidation';

export const useBookFormValidation = (initialData: BookFormData) => {
  const [formData, setFormData] = useState<BookFormData>(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof BookFormData, boolean>>({
    title: false,
    author: false,
    ISBN: false,
    quantity: false,
    shelf_location: false,
  });

  // Update form data and validate if field is touched
  const updateField = useCallback((field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [field]: error || undefined, // Remove error if empty string
      }));
    }
  }, [touched]);

  // Mark field as touched and validate
  const touchField = useCallback((field: keyof BookFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, [formData]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    // Mark all fields as touched
    setTouched({
      title: true,
      author: true,
      ISBN: true,
      quantity: true,
      shelf_location: true,
    });

    const errors = validateBookForm(formData);
    setValidationErrors(errors);
    return isFormValid(errors);
  }, [formData]);

  // Reset form to initial state
  const resetForm = useCallback((newData?: BookFormData) => {
    setFormData(newData || initialData);
    setValidationErrors({});
    setTouched({
      title: false,
      author: false,
      ISBN: false,
      quantity: false,
      shelf_location: false,
    });
  }, [initialData]);

  // Check if form has any validation errors
  const hasErrors = Object.values(validationErrors).some(error => !!error);

  return {
    formData,
    validationErrors,
    touched,
    hasErrors,
    updateField,
    touchField,
    validateForm,
    resetForm,
    setFormData, // For initial data updates
  };
};
