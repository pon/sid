import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class FileUpload extends Component {
  constructor() {
    super();
    this.state = {uploadedFiles: [], category: '', error: null};
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

    const uploadedFiles = this.state.uploadedFiles.concat(files);
    this.props.input.onChange(uploadedFiles);
    this.setState({
      uploadedFiles: uploadedFiles
    });
  }

  handleChange = (event, index, value) => this.setState({category: value});
  
  removeFile = (idxToRemove) => {
    const uploadedFiles = this.state.uploadedFiles.reduce((agg, file, idx) => {
      if (idx !== idxToRemove) {
        agg.push(file);
      }
      return agg
    }, []);

    this.props.input.onChange(uploadedFiles);

    this.setState({
      uploadedFiles: uploadedFiles
    });
  }

  componentWillMount() {
    if (this.props.categoryOverride) {
      this.setState({category: this.props.categoryOverride});
    }
  }

  render() {
    const dropzoneStyle = {
      width: '100%',
      textAlign: 'center',
      borderStyle: 'dashed',
      borderWidth: '1px',
      borderColor: 'black',
      height: '200px',
      lineHeight: '200px'
    };

    return (
      <div>
        {!this.props.categoryOverride && <SelectField fullWidth={true} floatingLabelText="Type" value={this.state.category} onChange={this.handleChange}>
          <MenuItem value="PAYSTUB" primaryText="Pay Stub" />
          <MenuItem value="ID" primaryText="ID" />
        </SelectField>}

        <Dropzone onDrop={this.onDrop.bind(this)} style={dropzoneStyle}>
          <p>{this.props.uploadMessage || 'Upload Files Here...'}</p>
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