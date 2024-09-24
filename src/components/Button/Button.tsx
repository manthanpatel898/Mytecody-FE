import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => (
  <button
    {...props}
    style={{
      padding: '0.75rem 1.5rem',
      backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

export default Button;
