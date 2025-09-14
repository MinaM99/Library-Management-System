import { useState, useCallback } from 'react';
import { 
  BorrowerValidationErrors, 
  BorrowerFormData, 
  validateBorrowerForm, 
  validateBorrowerField, 
  isBorrowerFormValid 
} from '@/utils/borrowerValidation';

export const useBorrowerFormValidation = (initialData: BorrowerFormData) => {
  const [formData, setFormData] = useState<BorrowerFormData>(initialData);
  const [validationErrors, setValidationErrors] = useState<BorrowerValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof BorrowerFormData, boolean>>({
    name: false,
    email: false,
  });

  // Update form data and validate if field is touched
  const updateField = useCallback((field: keyof BorrowerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateBorrowerField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [field]: error || undefined, // Remove error if empty string
      }));
    }
  }, [touched]);

  // Mark field as touched and validate
  const touchField = useCallback((field: keyof BorrowerFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateBorrowerField(field, formData[field]);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, [formData]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
    });

    const errors = validateBorrowerForm(formData);
    setValidationErrors(errors);
    return isBorrowerFormValid(errors);
  }, [formData]);

  // Reset form to initial state
  const resetForm = useCallback((newData?: BorrowerFormData) => {
    setFormData(newData || initialData);
    setValidationErrors({});
    setTouched({
      name: false,
      email: false,
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
