import Ingredient from './Ingredient';
import Input from './Input';
import React from 'react';
import BrewCalc from '../lib/BrewCalcs';

export default class Hop extends Ingredient {

  generateBoilOptions() {
    let options = [];

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
    this.handleChange({quantity: value}, this.notifyParent);
  }

  //returns true if the parent needs to be
  //notified about an internal state change
  //must remember to make this useful...
  notifyParent() {
    return this.state.handle;
  }

  render() {
    return (
      <tr>
        <td>
          <select
            value={ this.state.handle || 0 }
            onChange={ e => this.handleChange({hop: e.target.value}, this.notifyParent) }>
            { this.generateOptions('hop') }
          </select>
        </td>

        <td>
          <select
            value={ this.state.boil_time }
            onChange={ e => this.handleChange({boil_time: e.target.value}, this.notifyParent) }>
            { this.generateBoilOptions() }
          </select>
        </td>

        <td>
          <Input
            valid={ v => this.validateQty(v) }
            fireChange={ v => this.updateQty(v) }
            value={ this.displayQty() }>
          </Input>
          <span>
            { BrewCalc.unitSymbol[this.props.userPref.weight_small] }
          </span>
        </td>

        <td>
          <button onClick={ e => this.handleChange({_destroy: true}) }>x</button>
        </td>
      </tr>
    );
  }
}

Hop.markupTemplate = function() {
  return <tr><th>Hops</th><th>Boil Time</th><th>Qty</th><th>Remove</th></tr>
}

Hop.dataTemplate = function() {
  return {hop: '', boil_time: 0, quantity: 0};
}
