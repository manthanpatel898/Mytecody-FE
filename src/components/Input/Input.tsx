import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    {label && <label>{label}</label>}
    <input {...props} style={{ padding: '0.5rem', width: '100%' }} />
  </div>
);

export default Input;
