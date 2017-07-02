import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class FileUpload extends Component {
  constructor() {
    super();
    this.state = {uploadedFiles: []}
    this.state.category = null;
    this.state.error = null;
  }
  
  onDrop = files => {
    if (!this.state.category) {
      this.setState({error: 'You must select a type'});
      return;
    }

    files = files.map(file => {
      file.category = this.state.category;
      return file;
    });

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(files)
    });
  }

  handleChange = (event, index, value) => this.setState({category: value});
  
  removeFile = (idxToRemove) => {
    this.setState({
      uploadedFiles: this.state.uploadedFiles.reduce((agg, file, idx) => {
        if (idx !== idxToRemove) {
          agg.push(file);
        }
        return agg
      }, [])
    });
  }

  render() {
    const dropzoneStyle = {
      width: '100%',
      'text-align': 'center',
      'border-style': 'dashed',
      'border-width': '1px',
      'border-color': 'black',
      height: '200px',
      'line-height': '200px'
    };

    return (
      <div>
        <span>{this.state.error}</span>
        <SelectField fullWidth={true} floatingLabelText="Type" value={this.state.category} onChange={this.handleChange}>
          <MenuItem value="PAYSTUB" primaryText="Pay Stub" />
          <MenuItem value="ID" primaryText="ID" />
        </SelectField>

        <Dropzone onDrop={this.onDrop.bind(this)} style={dropzoneStyle}>
          <p>Upload Files Here...</p>
        </Dropzone>
        <List>
          {
            this.state.uploadedFiles.map((f, idx) => <ListItem primaryText={f.name} key={`${f.name} - ${idx}`} rightIcon={<ActionDelete onClick={this.removeFile.bind(this, idx)} />}></ListItem>)
          }
        </List>
      </div>
    )
  }
}

export default FileUpload;