import React from 'react';
import './Button.scss';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ type, children, onClick, className }) => {
  return (
    <button type={type} onClick={onClick} className={`custom-btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
