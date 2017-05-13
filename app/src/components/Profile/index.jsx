import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchProfile} from '../../reducers/profile';

export class Profile extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchProfile())
  }

  render () {
   const user = this.props.profile.get('user');
   if (user) {
      return (
        <div>
          <h1>Profile</h1>
          <h4>
            <small>User ID &nbsp;</small>
            {user.id}
          </h4>
          <h4> 
            <small>First Name &nbsp;</small>
            {user.first_name}
          </h4>
          <h4>
            <small>Last Name &nbsp;</small>
            {user.last_name}
          </h4>
          <h4>
            <small>Email &nbsp;</small>
            {user.email}
          </h4>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

const mapStateToProps = ({profile}) => ({
  profile
});

export default connect(mapStateToProps)(Profile);