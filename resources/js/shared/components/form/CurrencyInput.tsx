import React, { useEffect, InputHTMLAttributes, useState, useRef } from 'react';
import { extractNumericValue, formatCurrency, convertToFormValue, ReturnType } from '@/js/shared/helpers/moneyFormat';
import { cn } from '@/js/frontend-panel/lib/utils';

// Component-specific types
export interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  currency?: string;
  decimals?: number;
  locale?: string;
  initialValue?: number | null;
  returnType?: ReturnType;
  onValueChange?: (rawValue: number | null, formattedValue: string, formValue: number | string | null) => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'bordered';
}

/**
 * Currency Input Component with automatic formatting
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  currency = 'USD',
  decimals = 2,
  locale = 'pt-BR',
  initialValue = null,
  returnType = 'float',
  onValueChange,
  placeholder = 'Enter amount...',
  className = '',
  variant = 'default',
  disabled = false,
  ...inputProps
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const lastInitialValue = useRef<number | null>(initialValue);

  // Initialize display value when initialValue changes
  useEffect(() => {
    if (initialValue !== lastInitialValue.current) {
      lastInitialValue.current = initialValue;

      if (initialValue === null || initialValue === 0) {
        setDisplayValue('');
        setIsEditing(false);
      } else {
        const formattedValue = formatCurrency(initialValue, currency, decimals, locale);
        setDisplayValue(formattedValue);
        setIsEditing(false);
      }
    }
  }, [initialValue, currency, decimals, locale]);

  // Handle focus - start editing mode
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(true);
    if (inputProps.onFocus) {
      inputProps.onFocus(e);
    }
  };

  // Handle blur - end editing mode and format
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);

    // Format the value on blur if it's not empty
    if (displayValue && displayValue.trim() !== '') {
      const numericValue = extractNumericValue(displayValue, decimals);
      if (numericValue !== null) {
        const formattedValue = formatCurrency(numericValue, currency, decimals, locale);
        setDisplayValue(formattedValue);
      }
    }

    if (inputProps.onBlur) {
      inputProps.onBlur(e);
    }
  };

  // Handle input changes during editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // If input is empty, notify parent of null value
    if (!inputValue || inputValue.trim() === '') {
      if (onValueChange) {
        onValueChange(null, '', null);
      }
      return;
    }

    // Extract numeric value and notify parent
    const numericValue = extractNumericValue(inputValue, decimals);
    if (numericValue !== null) {
      const formValue = convertToFormValue(numericValue, returnType, decimals);
      if (onValueChange) {
        onValueChange(numericValue, inputValue, formValue);
      }

      // Auto-format while typing if we have any numeric input
      const numbersOnly = inputValue.replace(/\D/g, '');
      if (numbersOnly.length > 0) {
        const formattedValue = formatCurrency(numericValue, currency, decimals, locale);
        setDisplayValue(formattedValue);
      }
    } else {
      // If we can't extract a numeric value, still notify parent with null
      if (onValueChange) {
        onValueChange(null, inputValue, null);
      }
    }
  };

  // Use the same base classes as the Input component for dark mode compatibility
  const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(baseClasses, className)}
      {...inputProps}
    />
  );
};

/**
 * Currency Input with Label wrapper component
 */
export interface CurrencyInputWithLabelProps extends CurrencyInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const CurrencyInputWithLabel: React.FC<CurrencyInputWithLabelProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  ...currencyInputProps
}) => {
  const inputId = `currency-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <CurrencyInput
        id={inputId}
        className={`w-full ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...currencyInputProps}
      />

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Controlled Currency Input (for forms with external state management)
 */
export interface ControlledCurrencyInputProps extends Omit<CurrencyInputProps, 'initialValue' | 'onValueChange'> {
  value: number | null;
  onChange: (value: number | null) => void;
}

export const ControlledCurrencyInput: React.FC<ControlledCurrencyInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <CurrencyInput
      initialValue={value}
      onValueChange={(rawValue) => onChange(rawValue)}
      key={value?.toString() || 'null'} // Force re-render when external value changes
      {...props}
    />
  );
};

export default CurrencyInput;
