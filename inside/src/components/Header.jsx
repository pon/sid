import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {media} from '../utils/style-utils';

export class Header extends Component {
  render () {
    const StyledHeader = styled.header`
      background-color: #4688F1
      overflow: hidden;
      ${media.phone`
        a:not(:first-child):not(:last-child) {display:none;}
      `}
    `;

    const Item = styled.a`
      float: left;
      color: white;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;

      &:hover {
        background-color: #111
        text-decoration: none;
      }
  `;

    const ItemLink = styled(Item)`
      display: block;
    `;

    const ItemIcon = styled(Item)`
      display: none;
      ${media.phone`
        display: block;
      `}
    `;

    return (
      <StyledHeader>
        <ItemLink href="#">Inside</ItemLink>
        <ItemIcon href="#" icon>&#9776;</ItemIcon>
      </StyledHeader>
    );
  }
}

export default Header;