import React from 'react';

interface RequiredInputProps {
  label: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export default function RequiredInput({
  label,
  required = false,
  htmlFor,
  className = '',
  children,
}: RequiredInputProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
