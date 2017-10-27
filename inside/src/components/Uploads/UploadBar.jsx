import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router';

import {GridList, GridTile} from 'material-ui/GridList';
import LaunchIcon from 'material-ui/svg-icons/action/launch';

const UploadsWrapper = styled.div`
  display: 'flex';
  flexWrap: 'wrap';
  justify-content: 'space-around';
`;

export class UploadBar extends Component {
  render () {
    return (
      <UploadsWrapper style={this.props.style}>
        <h3>Uploads</h3>
        <GridList cellHeight={70}>
          {this.props.uploads.map(upload => {
            return (
              <GridTile 
                key={upload.id}
                cols={2}
                title={upload.category}
                subtitle={upload.file_name}
                actionIcon={<Link target="_blank" to={`/uploads/${upload.id}`}><LaunchIcon color="white" /></Link>}
              />
            );
          })}
        </GridList>
      </UploadsWrapper>
    );
  }
}

export default UploadBar;
