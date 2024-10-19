import React, { ChangeEvent } from 'react';
import './Input.scss';

interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string; // Handles input type (e.g., 'text', 'password')
  disabled?: boolean; // Optional prop for disabling the input, defaults to false
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type, disabled = false }) => {
  return (
    <div className={`input-container ${value ? 'has-value' : ''}`}>
      <input type={type} value={value} onChange={onChange} disabled={disabled} />
      <label>{label}</label>
    </div>
  );
};

export default Input;