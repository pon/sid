import React from 'react';
import styled from 'styled-components';

import {constants} from '../../utils/style-utils';

const GroupedError = styled.div`
  margin-top: -15px;
  margin-bottom: 10px;
  text-align: left;
  font-size: small;
  padding-top: 5px;
  color: ${constants.red}
  display: ${({touched, error}) => {
    if (touched && error) {
      return 'block';
    } else {
      return 'none';
    }
  }}
`;

export default ({input, label, type, meta: {touched, error}, className, placeholder}) => (
  <GroupedError touched={touched} error={error}>{error}</GroupedError>
)


