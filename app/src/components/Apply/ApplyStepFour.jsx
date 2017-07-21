import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';

import {TextField} from 'redux-form-material-ui';

const validate = values => {
  const errors = {};

  return errors;
};

const ApplyStepFourForm = props => {
  const {handleSubmit, submitting, submitApplyStepFour, valid} = props;

  const wrapperStyles = {width: '60%', margin: '0 auto', marginBottom: '1em'};

  const legalStyles = {fontSize: '12px'};

  return (
    <div style={wrapperStyles}>
      <form onSubmit={handleSubmit(submitApplyStepFour)}>
        <h4>Confirm &amp; Submit</h4>
        <p style={legalStyles}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eros nisi, semper id convallis at, tincidunt sed quam. Pellentesque lorem felis, lobortis eget diam sit amet, rhoncus viverra mauris. Nunc imperdiet non mi in ultricies. Nulla rutrum, ipsum at efficitur condimentum, lectus ex gravida massa, sit amet pretium sem dolor in orci. Donec eget nisi eleifend nulla fringilla tristique. Pellentesque eu tempor ligula. Etiam sit amet ante viverra, pharetra neque condimentum, luctus eros. Nullam lacinia vitae metus ac congue. Curabitur sed sem ut erat finibus scelerisque. Duis mi metus, congue sit amet laoreet eu, rutrum porttitor felis. Ut ut convallis arcu. Aenean ullamcorper turpis ut massa accumsan, vel imperdiet leo porttitor. Donec vehicula tincidunt porta. Nullam vehicula dolor in est dapibus, id iaculis risus sodales. Nunc vestibulum dui quis orci condimentum rutrum. Curabitur non nulla neque. Ut vehicula enim in aliquam laoreet. In ut justo accumsan, commodo felis vel, consequat lacus. Sed ut feugiat dolor. Sed fringilla venenatis tortor at consequat. Suspendisse potenti. Vivamus fringilla metus ligula, et ullamcorper ante interdum sed. Nulla imperdiet tincidunt enim, nec tempor felis varius ac. Integer rhoncus cursus efficitur. Sed eu nunc consequat, fringilla nisi bibendum, lacinia diam. Sed et accumsan enim. Duis fermentum pulvinar massa.
        </p>

        <Field name="social_security_number" fullWidth={true} component={TextField} type="text" hintText="Social Security Number" floatingLabelText="Social Security Number" />

        <RaisedButton fullWidth={true} label="Submit Application" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-step-four',
  validate
})(ApplyStepFourForm);


