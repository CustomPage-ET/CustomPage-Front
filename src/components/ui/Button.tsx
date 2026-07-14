'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm text-center inline-block cursor-pointer";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-indigo-600 hover:shadow-indigo-200 hover:shadow-lg",
    accent: "bg-brand-accent text-white hover:bg-emerald-600 hover:shadow-emerald-200 hover:shadow-lg",
    outline: "bg-white/80 border border-indigo-100 text-brand-dark hover:bg-indigo-50"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};