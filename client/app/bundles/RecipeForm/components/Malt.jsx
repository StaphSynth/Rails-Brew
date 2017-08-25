import React from 'react';
import Ingredient from './Ingredient';
import Input from './Input';
import BrewCalc from '../lib/BrewCalcs';

export default class Malt extends Ingredient {
  constructor(props) {
    super(props);
    this.state = this.props.ingredient;
  }

  decimalNumberRegex(){
    return /^[0-9]+(\.[0-9]+)?$/;
  }

  validateQty(qty) {
    return this.decimalNumberRegex().test(qty);
  }

  updateQty(value) {
    value = BrewCalc.unitConverter[this.props.userPref.weight_big]['M'](value);
    this.handleChange({quantity: value});
  }

  displayQty() {
    return BrewCalc.unitConverter['M'][this.props.userPref.weight_big](this.state.quantity);
  }

  render() {
    return (
      <tr>
        <td>
          <select
            id="malt"
            value={ this.state.malt }
            onChange={ e => this.handleChange({malt: e.target.value}) }>
            { this.generateOptions() }
          </select>
        </td>

        <td>
          <Input
            id="qty"
            valid={ v => this.validateQty(v) }
            fireChange={ v => this.updateQty(v) }
            value={ this.displayQty() }>
          </Input>
          <span>
            { BrewCalc.unitSymbol[this.props.userPref.weight_big] }
          </span>
        </td>

        <td>
          <button onClick={ e => this.handleChange({_destroy: true}) }>x</button>
        </td>
      </tr>
    );
  }
}
