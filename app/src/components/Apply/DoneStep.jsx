import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router';

import Faq from './Faq';

const DoneStep = props => {
  const wrapperStyles = {width: '75%', margin: '0 auto', marginBottom: '1em'};
  return (
    <div style={wrapperStyles}>
      <Faq
        header={<span>What Happens Now?</span>}
        body={<span>Thank you for submitting your application! We will begin processing it immediately and get you a decision within 2-3 days. Please keep an eye on your email for updates and potential follow up questions from the Poplar Team!</span>
}
      />
      <br />
      <div style={{width: '100%', textAlign: 'right'}}>
        <Link to='/dashboard'><RaisedButton label="Return to Dashboard" primary={true} /></Link>
      </div>
    </div>
  );
};

export default DoneStep;
