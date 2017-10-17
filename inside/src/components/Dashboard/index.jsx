import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import styled from 'styled-components';

import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {getApplicationStats} from '../../reducers/dashboard';

const DashboardWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
`;

export class Dashboard extends Component {

  componentWillMount() {
    this.props.getApplicationStats();
  }

  render () {
    const statusRouteMapper = {
      VERIFYING: '/verification'
    };
    const applicationStats = this.props.dashboard.get('applicationStats');
    let displayArray = [];
    if (applicationStats) {
      displayArray = Object.keys(applicationStats).reduce((agg, val) => {
        agg.push({
          ...applicationStats[val],
          link: statusRouteMapper[val]
        });
        return agg;
      }, []);
    }
    return (
      <DashboardWrapper>
        {displayArray.length && <Table selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn># Applications</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayArray.map(status => {
              return (
                <TableRow key={status.display}>
                  <TableRowColumn>{status.display}</TableRowColumn>
                  <TableRowColumn>{status.count}</TableRowColumn>
                  <TableRowColumn>{status.link && <Link to={status.link}><FlatButton label="View Applications" primary={true}/></Link>}</TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>}
      </DashboardWrapper>
    );
  }
}

const mapStateToProps = ({dashboard}) => {
  return {
    dashboard
  };
};

const mapDispatchToProps = dispatch => ({
  getApplicationStats: () => {
    return dispatch(getApplicationStats());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);