import React, {Component} from 'react';

import {constants} from '../../utils/style-utils';

export default class extends Component {
  render() {
    const {input, label, type, meta, className, placeholder} = this.props;
    const {touched, error} = meta;
    const styles = {
      background: touched && error && constants.paleRed
    };
    return <input {...input} type={type} className={className} placeholder={placeholder} style={styles}></input>
  }
}

