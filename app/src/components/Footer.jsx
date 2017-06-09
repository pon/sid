import React from 'react';
import styled from 'styled-components';
import {media} from '../utils/style-utils';

export default () => {
  const StyledFooter = styled.footer`
    height: 50px;
    background-color: #333;
    color: white;
    padding: 14px 16px;
    text-align: center;
  `;

  return (
    <StyledFooter>&copy; PON 2017</StyledFooter>
  );
}