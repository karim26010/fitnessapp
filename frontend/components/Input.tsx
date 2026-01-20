import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input
          className={`
            w-full bg-slate-100 text-slate-900 placeholder-slate-400
            rounded-xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white
            transition-all duration-300 ease-out font-medium
            ${error ? 'ring-2 ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};