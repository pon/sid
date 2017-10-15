import React from 'react';

export default ({input, label, type, meta: {touched, error}, className, placeholder}) => (
  <div>
    <input {...input} type={type} className={className} placeholder={placeholder || label}/>
    {touched && error && <span>{error}</span>}
  </div>
)