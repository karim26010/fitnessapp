import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  fullWidth, 
  className,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 focus:ring-primary-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500",
    outline: "border-2 border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white bg-transparent",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50",
  };

  const sizes = "py-3.5 px-6 text-sm";

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};