import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {TextField} from 'redux-form-material-ui';
import {green100, green500} from 'material-ui/styles/colors';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const headerColor = profile => {
  if (!profile.identity_verified || !profile.citizenship_verified) {
    return green100;
  } else {
    return green500;
  }
};

const headerText = profile => {
  if (!profile.identity_verified || !profile.citizenship_verified) {
    return <span><CheckBoxOutline />Personal Details</span>;
  } else {
    return <span><CheckBox />Personal Details</span>
  }
};

const formatAddress = address => {
  let addressString = address.street_one;
  if (address.street_two) {
    addressString += ` ${address.street_two}`;
  }
  
  return addressString
};

const formatCityState = address => {
  return `${address.city}, ${address.state_id} ${address.zip_code}`;
};

const ProfileSection = ({
  profile, 
  style, 
  unverifyCitizenship, 
  unverifyIdentity, 
  verifyCitizenship, 
  verifyIdentity}) => {
    return (
      <div style={style}>
        <h3>Profile</h3>
        <Card style={{width: '100%'}}>
          <CardHeader title={headerText(profile)} style={{backgroundColor: headerColor(profile)}} />
          <CardText>
            <TextField 
              name="name"
              floatingLabelText="Name" 
              fullWidth={true}
              value={`${profile.first_name} ${profile.last_name}`} 
              disabled={true}/><br />
            <TextField
              name="address"
              floatingLabelText="Address"
              fullWidth={true}
              value={formatAddress(profile.current_address)}
              disabled={true} /><br />
            <TextField
              name="citystate"
              fullWidth={true}
              value={formatCityState(profile.current_address)}
              disabled={true} />
          </CardText>
          <CardActions style={{width: '100%', textAlign: 'right'}}>
            {!profile.identity_verified && 
              <RaisedButton 
                label="Verify Identity" 
                primary={true} 
                onClick={() => {verifyIdentity(profile.user_id)}}/>
            }
            {profile.identity_verified && 
              <RaisedButton 
                label="Unverify Identity" 
                secondary={true} 
                onClick={() => {unverifyIdentity(profile.user_id)}}/>
            }
            {!profile.citizenship_verified && 
              <RaisedButton 
                label="Verify Citizenship" 
                primary={true}
                onClick={() => {verifyCitizenship(profile.user_id)}}/>
            }
            {profile.citizenship_verified && 
              <RaisedButton 
                label="Unverify Citizenship" 
                secondary={true}
                onClick={() => {unverifyCitizenship(profile.user_id)}}/>
            }
          </CardActions>
        </Card>
      </div>
    );
};

export default ProfileSection;
