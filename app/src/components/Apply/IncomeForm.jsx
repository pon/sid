import React, {Component} from 'react';
import {TextField} from 'redux-form-material-ui';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class IncomeSection extends Component {
  constructor() {
    super();
    this.state = {};
  }  

  handleTypeChange = (event, index, value) => this.setState({income_type: value, employer_name: ''});
  handleEmployerChange = (event, value) => this.setState({employer_name: value});
  handleIncomeChange = (event, value) => this.setState({stated_income: value});

  addIncome = () => this.props.onSave(this.state);
  removeIncome = () => this.props.onRemove(this.props.idx);

  render() {
    const incomeTypeLookup = {
      SALARY: 'Salary',
      SELF_EMPLOYED: 'Self-Employed',
      RENTAL: 'Rental',
      SOCIAL_SECURITY_PENSION: 'Social Security / Pension',
      DISABILITY: 'Disability',
      CHILD_SUPPORT_ALIMONY: 'Child Support / Alimony',
      K1: 'K1'
    };

    return (
      <div>
        {this.props.income &&
        <div>
          <ListItem 
            primaryText={`${this.props.income.employer_name || incomeTypeLookup[this.props.income.income_type]} - $${Number(this.props.income.stated_income).toLocaleString()}`}
            rightIcon={<ActionDelete onClick={this.removeIncome} />}
           />
        </div>
        }
        {!this.props.income && 
        <div>
          <SelectField fullWidth={true} hintText="Type" value={this.state.income_type} onChange={this.handleTypeChange}>
            {Object.keys(incomeTypeLookup).map(type =><MenuItem key={type} value={type} primaryText={incomeTypeLookup[type]} />)}
          </SelectField>
          {this.state.income_type === 'SALARY' && <TextField fullWidth={true} name="employer_name" hintText="Employer Name" type="text" onChange={this.handleEmployerChange} value={this.state.employer_name}/>}
          <TextField fullWidth={true} name="stated_income" hintText="Gross Annual Income" type="number" onChange={this.handleIncomeChange} value={this.state.stated_income}/>
          <div style={{textAlign: 'right'}}>
            <FlatButton label="Add Income" onClick={this.addIncome} primary={true} />
          </div> 
        </div>
        }
      </div>
    )
  }
}

class IncomeForm extends Component {
  constructor() {
    super();
    this.state = {
      incomes: []
    };
  }  

  componentDidMount() {
    if (this.props.meta.initial) {
      this.setState({incomes: this.props.meta.initial});
    }
  }

  addIncome = income => {
    const incomes = this.state.incomes.concat([income]);
    this.props.input.onChange(incomes)
    this.setState({incomes: incomes})
  }

  removeIncome = idxToRemove => {
    const incomes = this.state.incomes.reduce((agg, income, idx) => {
      if (idx !== idxToRemove) {
        agg.push(income);
      }
      return agg;
    }, []);

    this.props.input.onChange(incomes)
    this.setState({incomes: incomes});
  }

  render() {
    return (
      <div>
        <span>{this.props.meta.dirty && this.props.meta.error}</span>
        <IncomeSection title="New Income" onSave={this.addIncome}/>
        <List>
        {
          this.state.incomes.map((i, idx) => <IncomeSection title={`Income ${idx+1}`} key={idx} idx={idx} income={i} onRemove={this.removeIncome}/>)
        }
        </List>
      </div>
    )
  }
}

export default IncomeForm;