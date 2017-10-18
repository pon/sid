import React from 'react';
import styled from 'styled-components';

export default () => {
  const StyledFooter = styled.footer`
    height: 50px;
    background-color: #333;
    color: white;
    padding: 14px 16px;
    text-align: center;
  `;

  return (
    <StyledFooter>&copy; Poplar 2017</StyledFooter>
  );
}
