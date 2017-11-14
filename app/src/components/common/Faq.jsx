import React from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {blue50} from 'material-ui/styles/colors';

export default ({header, body}) => (
  <Paper style={{padding: '10px', fontSize: '14px', backgroundColor: blue50}}>
    <h6 style={{paddingRight: '10px', paddingLeft: '10px'}}>{header}</h6>
    <Divider />
    <p style={{paddingRight: '10px', paddingLeft: '10px', paddingTop: '10px'}}>
      {body}
    </p>
  </Paper>
)
