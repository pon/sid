import React from 'react';

import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {blue100} from 'material-ui/styles/colors';

export default (props) => {
  return (
    <Card>
      <CardHeader
        title={`Application ${props.idx + 1}`}
        subtitle={props.application.status}
        style={{backgroundColor: blue100}}/>
      <CardActions style={{width: '100%', textAlign: 'right'}}>
        {props.application.status === 'APPLYING' && <FlatButton label="Continue Application" href="/apply" primary={true} />}
        {props.application.status === 'VERIFYING' && <FlatButton label="Upload Additional Documents" href={`/upload/${props.application.id}`} primary={true}/>}
        {props.application.status === 'APPROVED' && <FlatButton label="Accept Loan Offer" href="/checkout" primary={true}></FlatButton>}
      </CardActions>
    </Card>
  );
}
