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

  render() {
    return (
      <tr>
        <td>
          <select
            id="malt"
            value={ this.state.malt }
            onChange={ e => this.handleChange('malt', e.target.value) }>
            { this.generateOptions() }
          </select>
        </td>

        <td>
          <Input
            id="qty"
            valid={ v => this.validateQty(v) }
            fireChange={ v => this.handleChange('quantity', v) }
            value={ this.state.quantity } />
          <span>
            g
          </span>
        </td>

        <td>
          <button onClick={ e => this.handleChange('_destroy', true) }>x</button>
        </td>
      </tr>
    );
  }
}
