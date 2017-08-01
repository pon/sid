import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import DashboardCard from './DashboardCard';

import {getDashboard} from '../../reducers/dashboard';

export class Dashboard extends Component {

  componentWillMount() {
    return this.props.getDashboard();
  }

  render () {
    const applications = this.props.dashboard.get('applications');
    const DashboardWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    return (
      <DashboardWrapper>
        <h2>Dashboard</h2>
        {
          applications && applications.map((app, idx) => <DashboardCard key={idx} idx={idx} application={app}/>)        
        }
      </DashboardWrapper>
    );
  }
}

const mapStateToProps = ({dashboard}) => ({
  dashboard
})

const mapDispatchToProps = (dispatch) => ({
  getDashboard: () => {
    return dispatch(getDashboard());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);