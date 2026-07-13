import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-brand-dark mb-1.5 ml-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 bg-brand-card rounded-xl border border-gray-200 text-brand-dark text-sm transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-indigo-100 placeholder-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
};