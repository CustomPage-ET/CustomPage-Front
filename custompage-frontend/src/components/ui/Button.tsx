import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = "w-full px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98] text-center inline-block";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-indigo-600 shadow-sm",
    secondary: "bg-brand-dark text-white hover:bg-slate-900 shadow-sm",
    outline: "bg-transparent border border-gray-200 text-brand-dark hover:bg-gray-50"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};