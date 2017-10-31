import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {TextField} from 'redux-form-material-ui';
import {green500} from 'material-ui/styles/colors';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';

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

const formatDate = startDate => {
  startDate = new Date(startDate);
  return `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}` ;
};

const LeaseSection = ({lease, style}) => {
  return (
    <div style={style}>
      <h3>Lease</h3>
      <Card style={{width: '100%', marginBottom: '25px'}}>
        <CardHeader title={<span><CheckBox /> Lease Details</span>} style={{backgroundColor: green500}} />
        <CardText>
          <TextField
            floatingLabelText="Security Deposit" 
            name="securitydeposit"
            style={{width: '45%', float: 'left'}}
            value={lease.security_deposit}
            disabled={true} />
          <TextField
            name="rent"
            floatingLabelText="Monthly Rent"
            style={{width: '45%', float: 'right'}}
            value={lease.monthly_rent}
            disabled={true} /><br />
          <TextField
            name="startdate"
            style={{width: '45%', float: 'left'}}
            floatingLabelText="Lease Start Date"
            value={formatDate(lease.start_date)}
            disabled={true} />
          <TextField
            name="length"
            style={{width: '45%', float: 'right'}}
            floatingLabelText="Lease Length"
            value={`${lease.term_months} Months`}
            disabled={true} /><br />
          <TextField
            name="address"
            floatingLabelText="Address"
            fullWidth={true}
            value={formatAddress(lease.address)}
            disabled={true} /><br />
          <TextField
            name="citystate"
            fullWidth={true}
            value={formatCityState(lease.address)}
            disabled={true} /><br />
        </CardText>
      </Card>
    </div>
  );
};

export default LeaseSection;
