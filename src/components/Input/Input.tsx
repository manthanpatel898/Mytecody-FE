import React, { ChangeEvent, useState } from 'react';
import './Input.scss';

interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string; // Add this to handle input type (e.g., 'text', 'password')
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type }) => {
  return (
    <div className={`input-container ${value ? 'has-value' : ''}`}>
      <input type={type} value={value} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};

export default Input;
