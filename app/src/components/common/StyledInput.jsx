import React from 'react';
import styled from 'styled-components';

import {constants} from '../../utils/style-utils';

const StyledInput = styled.input`
  background: ${({meta: {touched, error}}) => touched && error && constants.paleRed};
`;

export default ({input, label, type, meta, className, placeholder}) => (
  <StyledInput {...input} type={type} meta={meta} className={className} placeholder={placeholder}></StyledInput>
)

