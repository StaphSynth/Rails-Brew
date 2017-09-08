import Ingredient from './Ingredient';
import Input from './Input';
import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import Utils from '../lib/Utils';
import Spinner from './Spinner';

export default class Hop extends Ingredient {
  constructor(props) {
    super(props);

    let ingredient = this.props.ingredient;
    ingredient.ibu = null;
    this.state = ingredient;
  }

  generateBoilOptions() {
    let options = [];

    //for every five minutes of the hour
    for(let i = 0; i <= 60; i += 5) {
      options.push(
        <option
          key={ i }
          value={ i }>
          { i }
        </option>
      );
    }
    options.push(<option key={ options.length } value="90">90</option>);
    return options;
  }

  displayQty() {
    let value = this.state.quantity;
    return BrewCalc.unitConverter['M'][this.props.userPref.weight_small](value);
  }

  updateQty(value) {
    value = BrewCalc.unitConverter[this.props.userPref.weight_small]['M'](value);
    this.handleChange({quantity: value, ibu: null}, this.getIbuContribution);
  }

  render() {
    return (
      <tr>
        <td>
          <select
            value={ this.state.handle || 0 }
            onChange={ e => this.handleChange({handle: e.target.value, ibu: null}, this.getIbuContribution) }>
            { this.generateOptions('hop') }
          </select>
        </td>

        <td>
          <select
            value={ this.state.boil_time }
            onChange={ e => this.handleChange({boil_time: e.target.value, ibu: null}, this.getIbuContribution) }>
            { this.generateBoilOptions() }
          </select>
        </td>

        <td>
          <Input
            valid={ v => this.validateQty(v) }
            fireChange={ v => this.updateQty(v) }
            value={ this.displayQty() }>
          </Input>
        </td>

        <td>
          { this.props.contribution }
        </td>

        <td>
          <button onClick={ e => this.handleChange({_destroy: true}) }>x</button>
        </td>
      </tr>
    );
  }
}

Hop.markupTemplate = function(userPref) {
  return (
    <tr>
      <th>Hops</th>
      <th>Boil Time</th>
      <th>Quantity ({ BrewCalc.unitSymbol[userPref.weight_small] })</th>
      <th>IBU</th>
      <th>Remove</th>
    </tr>
  );
}

Hop.dataTemplate = function() {
  return {hop: '', boil_time: 0, quantity: 0};
}
