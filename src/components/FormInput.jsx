import React from 'react';

export function FormInput({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  tooltip,
  ...props 
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {tooltip && (
          <span className="tooltip" data-tooltip={tooltip}>ℹ️</span>
        )}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
}

export function FormSelect({ 
  label, 
  id, 
  value, 
  onChange, 
  options, 
  required = false,
  tooltip 
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {tooltip && (
          <span className="tooltip" data-tooltip={tooltip}>ℹ️</span>
        )}
      </label>
      <select 
        id={id} 
        value={value} 
        onChange={onChange} 
        required={required}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormCheckbox({ 
  label, 
  id, 
  checked, 
  onChange, 
  tooltip 
}) {
  return (
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
        />
        {label}
        {tooltip && (
          <span className="tooltip" data-tooltip={tooltip}>ℹ️</span>
        )}
      </label>
    </div>
  );
}

