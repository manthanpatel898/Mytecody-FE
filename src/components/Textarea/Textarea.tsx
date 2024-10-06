import React, { ChangeEvent } from 'react';
import './Textarea.scss'; // You can use the same SCSS file if you want to keep the styling consistent

interface TextareaProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({ label, value, onChange }) => {
  return (
    <div className={`input-container ${value ? 'has-value' : ''}`}>
      <textarea value={value} onChange={onChange} rows={5} />
      <label>{label}</label>
    </div>
  );
};

export default Textarea;
