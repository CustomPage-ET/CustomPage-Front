import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">
        {label}
      </label>
      <input
        className={`w-full px-5 py-3.5 bg-white rounded-3xl border-2 border-brand-dark text-brand-dark text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 placeholder-gray-400 shadow-[2px_2px_0px_0px_rgba(30,27,75,1)] focus:shadow-none ${className}`}
        {...props}
      />
    </div>
  );
};