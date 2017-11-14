import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {grey100} from 'material-ui/styles/colors';
import {SelectField, TextField} from 'redux-form-material-ui';

import Faq from '../common/Faq';
import FileUpload from '../common/FileUpload';

const PayoffDetailsForm = props => {
  const {submitting, valid, handleSubmit, submitCheckoutPayoffDetails} = props;

  const wrapperStyles = {width: '75%', margin: '0 auto', marginBottom: '1em'};

  return (
    <div style={wrapperStyles}>
      <Faq
        header={<span>What should I upload?</span>}
        body={<span>Please upload a copy of your new lease. We will use this to verify the security deposit amount and landlord information.</span>}
      />
      <br />
      <form onSubmit={handleSubmit(submitCheckoutPayoffDetails)}>
        <Field name="files" type="file" component={FileUpload} categoryOverride={'lease'} uploadMessage={'Upload Your Lease Here'}/>

        <Card>
          <CardHeader title={<h5>Landlord Details</h5>} style={{backgroundColor: grey100}} />
          <CardText>
            <Field name="landlord.name" fullWidth={true} component={TextField} type="text" hintText="Name" />
            <Field name="landlord.phone_number" fullWidth={true} component={TextField} type="text" hintText="Phone Number" />
            <Field name="landlord.email" fullWidth={true} component={TextField} type="email" hintText="Email" />
            <Field name="landlord.street_one" fullWidth={true} component={TextField} type="text" hintText="Address Line One" />
            <Field name="landlod.street_two" fullWidth={true} component={TextField} type="text" hintText="Address Line Two" />
            <Field name="landlord.city" fullWidth={true} component={TextField} type="text" hintText="City" />
            <Field name="landlord.state" fullWidth={true} component={SelectField} hintText="State">
              <MenuItem value="AL" primaryText="Alabama" />
              <MenuItem value="AK" primaryText="Alaska" />
              <MenuItem value="AS" primaryText="American Samoa" />
              <MenuItem value="AZ" primaryText="Arizona" />
              <MenuItem value="AR" primaryText="Arkansas" />
              <MenuItem value="AA" primaryText="Armed Forces Americas (except Canada)" />
              <MenuItem value="AE" primaryText="Armed Forces Europe, the Middle East, and Canada" />
              <MenuItem value="AP" primaryText="Armed Forces Pacific" />
              <MenuItem value="CA" primaryText="California" />
              <MenuItem value="CO" primaryText="Colorado" />
              <MenuItem value="CT" primaryText="Connecticut" />
              <MenuItem value="DE" primaryText="Delaware" />
              <MenuItem value="DC" primaryText="District of Columbia" />
              <MenuItem value="FM" primaryText="Federated States of Micronesia" />
              <MenuItem value="FL" primaryText="Florida" />
              <MenuItem value="GA" primaryText="Georgia" />
              <MenuItem value="GU" primaryText="Guam" />
              <MenuItem value="HI" primaryText="Hawaii" />
              <MenuItem value="ID" primaryText="Idaho" />
              <MenuItem value="IL" primaryText="Illinois" />
              <MenuItem value="IN" primaryText="Indiana" />
              <MenuItem value="IA" primaryText="Iowa" />
              <MenuItem value="KS" primaryText="Kansas" />
              <MenuItem value="KY" primaryText="Kentucky" />
              <MenuItem value="LA" primaryText="Louisiana" />
              <MenuItem value="ME" primaryText="Maine" />
              <MenuItem value="MH" primaryText="Marshall Islands" />
              <MenuItem value="MD" primaryText="Maryland" />
              <MenuItem value="MA" primaryText="Massachusetts" />
              <MenuItem value="MI" primaryText="Michigan" />
              <MenuItem value="MN" primaryText="Minnesota" />
              <MenuItem value="MS" primaryText="Mississippi" />
              <MenuItem value="MO" primaryText="Missouri" />
              <MenuItem value="MT" primaryText="Montana" />
              <MenuItem value="NE" primaryText="Nebraska" />
              <MenuItem value="NV" primaryText="Nevada" />
              <MenuItem value="NH" primaryText="New Hampshire" />
              <MenuItem value="NJ" primaryText="New Jersey" />
              <MenuItem value="NM" primaryText="New Mexico" />
              <MenuItem value="NY" primaryText="New York" />
              <MenuItem value="NC" primaryText="North Carolina" />
              <MenuItem value="ND" primaryText="North Dakota" />
              <MenuItem value="MP" primaryText="Northern Mariana Islands" />
              <MenuItem value="OH" primaryText="Ohio" />
              <MenuItem value="OK" primaryText="Oklahoma" />
              <MenuItem value="OR" primaryText="Oregon" />
              <MenuItem value="PW" primaryText="Palau" />
              <MenuItem value="PA" primaryText="Pennsylvania" />
              <MenuItem value="PR" primaryText="Puerto Rico" />
              <MenuItem value="RI" primaryText="Rhode Island" />
              <MenuItem value="SC" primaryText="South Carolina" />
              <MenuItem value="SD" primaryText="South Dakota" />
              <MenuItem value="TN" primaryText="Tennessee" />
              <MenuItem value="TX" primaryText="Texas" />
              <MenuItem value="UT" primaryText="Utah" />
              <MenuItem value="VT" primaryText="Vermont" />
              <MenuItem value="VA" primaryText="Virginia" />
              <MenuItem value="VI" primaryText="Virgin Islands" />
              <MenuItem value="WA" primaryText="Washington" />
              <MenuItem value="WV" primaryText="West Virginia" />
              <MenuItem value="WI" primaryText="Wisconsin" />
              <MenuItem value="WY" primaryText="Wyoming" />
            </Field>
            <Field name="landlord.zip_code" fullWidth={true} component={TextField} type="text" hintText="Zip Code" /> 
          </CardText>
        </Card>
        <br />
        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'payoff-details'
})(PayoffDetailsForm);
