import { useState, useCallback, ChangeEvent } from 'react';

// Type definitions
export type ReturnType = 'float' | 'int' | 'string';

export interface CurrencyFormatterConfig {
  currency?: string;
  decimals?: number;
  locale?: string;
  initialValue?: number | null;
  returnType?: ReturnType;
}

export interface UseCurrencyFormatterReturn {
  value: string;
  rawValue: number | null;
  formValue: number | string | null; // Value ready for form submission
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValue: (value: number | null) => void;
}

/**
 * Formats a numeric value as currency
 * @param value - Numeric value to be formatted
 * @param currency - Currency code (e.g., USD, EUR, BRL)
 * @param decimals - Number of decimal places
 * @param locale - Locale for formatting (e.g., 'pt-BR', 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | null,
  currency: string = 'USD',
  decimals: number = 2,
  locale: string = 'pt-BR'
): string => {
  if (value === null || value === undefined) return '';

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  };

  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Extracts numeric value from formatted currency string
 * @param input - Input string (can contain currency symbols and formatting)
 * @param decimals - Number of decimal places to consider
 * @returns Numeric value or null if empty
 */
export const extractNumericValue = (input: string, decimals: number = 2): number | null => {
  // If input is empty or only whitespace, return null
  if (!input || input.trim() === '') return null;

  // Extract only numbers from input
  const numbersOnly = input.replace(/\D/g, '');

  // If no numbers found, return null
  if (!numbersOnly) return null;

  // Convert to actual decimal value
  return parseFloat(numbersOnly) / Math.pow(10, decimals);
};

/**
 * Validates if a currency code is supported
 * @param currency - Currency code to validate
 * @returns Boolean indicating if currency is valid
 */
export const isValidCurrency = (currency: string): boolean => {
  try {
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Converts a numeric value to the specified return type for form submission
 * @param value - Numeric value to convert
 * @param returnType - Type to return ('float', 'int', 'string')
 * @param decimals - Number of decimal places (for string formatting)
 * @returns Converted value in the specified type
 */
export const convertToFormValue = (
  value: number | null,
  returnType: ReturnType = 'float',
  decimals: number = 2
): number | string | null => {
  if (value === null) return null;

  switch (returnType) {
    case 'int':
      return Math.round(value * Math.pow(10, decimals)); // Convert to cents/smallest unit
    case 'string':
      return value.toFixed(decimals);
    case 'float':
    default:
      return value;
  }
};

/**
 * Hook for currency formatting with React state management
 * @param config - Configuration object
 * @returns Object with formatted value, raw value, form value, change handler, and setter
 */
export const useCurrencyFormatter = ({
  currency = 'USD',
  decimals = 2,
  locale = 'pt-BR',
  initialValue = null,
  returnType = 'float'
}: CurrencyFormatterConfig = {}): UseCurrencyFormatterReturn => {
  const [rawValue, setRawValue] = useState<number | null>(initialValue);

  const formatValue = useCallback((value: number | null): string => {
    return formatCurrency(value, currency, decimals, locale);
  }, [currency, decimals, locale]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    const numericValue = extractNumericValue(inputValue, decimals);
    setRawValue(numericValue);
  }, [decimals]);

  const formattedValue = formatValue(rawValue);
  const formValue = convertToFormValue(rawValue, returnType, decimals);

  return {
    value: formattedValue,
    rawValue: rawValue,
    formValue: formValue,
    onChange: handleChange,
    setValue: setRawValue
  };
};

/**
 * Currency formatter utility class (alternative OOP approach)
 */
export class MoneyFormatter {
  private currency: string;
  private decimals: number;
  private locale: string;
  private returnType: ReturnType;

  constructor(
    currency: string = 'USD',
    decimals: number = 2,
    locale: string = 'pt-BR',
    returnType: ReturnType = 'float'
  ) {
    this.currency = currency;
    this.decimals = decimals;
    this.locale = locale;
    this.returnType = returnType;
  }

  /**
   * Format a number as currency
   */
  format(value: number | null): string {
    return formatCurrency(value, this.currency, this.decimals, this.locale);
  }

  /**
   * Parse currency string to number
   */
  parse(input: string): number | null {
    return extractNumericValue(input, this.decimals);
  }

  /**
   * Get value ready for form submission
   */
  getFormValue(value: number | null): number | string | null {
    return convertToFormValue(value, this.returnType, this.decimals);
  }

  /**
   * Update formatter configuration
   */
  configure(config: Partial<CurrencyFormatterConfig>): void {
    if (config.currency) this.currency = config.currency;
    if (config.decimals !== undefined) this.decimals = config.decimals;
    if (config.locale) this.locale = config.locale;
    if (config.returnType) this.returnType = config.returnType;
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<Omit<CurrencyFormatterConfig, 'initialValue'>> {
    return {
      currency: this.currency,
      decimals: this.decimals,
      locale: this.locale,
      returnType: this.returnType
    };
  }
}

// Common currency configurations
export const CURRENCY_CONFIGS = {
        USD: { currency: 'USD', locale: 'en-US', decimals: 2 },
        EUR: { currency: 'EUR', locale: 'de-DE', decimals: 2 },
        BRL: { currency: 'BRL', locale: 'pt-BR', decimals: 2 },
        JPY: { currency: 'JPY', locale: 'ja-JP', decimals: 0 },
        GBP: { currency: 'GBP', locale: 'en-GB', decimals: 2 },
        CAD: { currency: 'CAD', locale: 'en-CA', decimals: 2 },
        AOA: { currency: 'AOA', locale: 'pt-AO', decimals: 2 },
        AUD: { currency: 'AUD', locale: 'en-AU', decimals: 2 },
        CHF: { currency: 'CHF', locale: 'de-CH', decimals: 2 },
        CNY: { currency: 'CNY', locale: 'zh-CN', decimals: 2 },
        INR: { currency: 'INR', locale: 'hi-IN', decimals: 2 },
        MXN: { currency: 'MXN', locale: 'es-MX', decimals: 2 },
        ZAR: { currency: 'ZAR', locale: 'en-ZA', decimals: 2 },
        KRW: { currency: 'KRW', locale: 'ko-KR', decimals: 0 },
        SGD: { currency: 'SGD', locale: 'en-SG', decimals: 2 },
        NZD: { currency: 'NZD', locale: 'en-NZ', decimals: 2 },
        RUB: { currency: 'RUB', locale: 'ru-RU', decimals: 2 },
        SEK: { currency: 'SEK', locale: 'sv-SE', decimals: 2 },
        NOK: { currency: 'NOK', locale: 'nb-NO', decimals: 2 },
        DKK: { currency: 'DKK', locale: 'da-DK', decimals: 2 },
        TRY: { currency: 'TRY', locale: 'tr-TR', decimals: 2 },
        AED: { currency: 'AED', locale: 'ar-AE', decimals: 2 },
        SAR: { currency: 'SAR', locale: 'ar-SA', decimals: 2 },
        HKD: { currency: 'HKD', locale: 'zh-HK', decimals: 2 },
        ARS: { currency: 'ARS', locale: 'es-AR', decimals: 2 },
        CLP: { currency: 'CLP', locale: 'es-CL', decimals: 0 },
        COP: { currency: 'COP', locale: 'es-CO', decimals: 2 },
        EGP: { currency: 'EGP', locale: 'ar-EG', decimals: 2 },
        IDR: { currency: 'IDR', locale: 'id-ID', decimals: 2 },
        MYR: { currency: 'MYR', locale: 'ms-MY', decimals: 2 },
        PHP: { currency: 'PHP', locale: 'fil-PH', decimals: 2 },
        PLN: { currency: 'PLN', locale: 'pl-PL', decimals: 2 },
        THB: { currency: 'THB', locale: 'th-TH', decimals: 2 },
        VND: { currency: 'VND', locale: 'vi-VN', decimals: 0 },
        BGN: { currency: 'BGN', locale: 'bg-BG', decimals: 2 },
        CZK: { currency: 'CZK', locale: 'cs-CZ', decimals: 2 },
        HUF: { currency: 'HUF', locale: 'hu-HU', decimals: 2 },
        RON: { currency: 'RON', locale: 'ro-RO', decimals: 2 },
        ISK: { currency: 'ISK', locale: 'is-IS', decimals: 0 },
        UAH: { currency: 'UAH', locale: 'uk-UA', decimals: 2 },
        KES: { currency: 'KES', locale: 'sw-KE', decimals: 2 },
        NGN: { currency: 'NGN', locale: 'en-NG', decimals: 2 },
        PKR: { currency: 'PKR', locale: 'ur-PK', decimals: 2 },
        BDT: { currency: 'BDT', locale: 'bn-BD', decimals: 2 }
} as const;


export type CurrencyType = keyof typeof CURRENCY_CONFIGS;
