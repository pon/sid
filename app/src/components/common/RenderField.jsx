import React from 'react';

export default ({input, label, type, meta: {touched, error}, className, placeholder}) => (
  <div>
    <input {...input} placeholder={label} type={type} className={className} placeholder={placeholder}/>
    {touched && error && <span>{error}</span>}
  </div>
)