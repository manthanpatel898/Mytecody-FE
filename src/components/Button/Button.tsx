import React from 'react';
import './Button.scss';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean; // Add disabled as an optional prop
}

const Button: React.FC<ButtonProps> = ({ type, children, onClick, className, disabled }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`custom-btn ${className}`} 
      disabled={disabled} // Pass disabled to the button
    >
      {children}
    </button>
  );
};

export default Button;
