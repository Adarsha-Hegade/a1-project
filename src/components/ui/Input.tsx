import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
        placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 
        dark:bg-gray-800 dark:border-gray-700 dark:text-white ${className}`}
      {...props}
    />
  );
};