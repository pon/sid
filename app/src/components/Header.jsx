import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router';

import styled from 'styled-components';
import {media} from '../utils/style-utils';

import {submitLogout} from '../reducers/login';

export class Header extends Component {
  render () {
    const StyledHeader = styled.header`
      background-color: #333
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

    const LogInOut = styled(Item)`
      float: right;
    `;

    const LogInOutClick = () => {
      if (this.props.isAuthenticated) {
        return this.props.submitLogout();
      } else {
        return push('/login');
      }
    }

    return (
      <StyledHeader>
        <ItemLink href="#">Link 1</ItemLink>
        <ItemLink href="#">Link 2</ItemLink>
        <ItemLink href="#">Link 3</ItemLink>
        <ItemIcon href="#" icon>&#9776;</ItemIcon>
        <LogInOut onClick={this.props.submitLogout}>
          {this.props.isAuthenticated ? 'Log Out': 'Log In'}
        </LogInOut>
      </StyledHeader>
    );
  }
}

export default connect(({login}) => {
  return {
    isAuthenticated: login.get('isAuthenticated')
  }
}, dispatch => ({
  submitLogout: () => {
    return dispatch(submitLogout())
  }
}))(Header);