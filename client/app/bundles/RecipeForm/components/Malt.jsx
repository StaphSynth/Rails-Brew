import React from 'react';
import Ingredient from './Ingredient';
import Input from './Input';
import BrewCalc from '../lib/BrewCalcs';

export default class Malt extends Ingredient {

  updateQty(value) {
    value = BrewCalc.unitConverter[this.props.userPref.weight_big]['M'](value);
    this.handleChange({quantity: value}, this.notifyParent);
  }

  displayQty() {
    return BrewCalc.unitConverter['M'][this.props.userPref.weight_big](this.state.quantity);
  }

  //returns true if the parent needs to be
  //notified about an internal state change
  //To do: make this useful...
  notifyParent() {
    return this.state.malt;
  }

  render() {
    return (
      <tr>
        <td>
          <select
            id="malt"
            value={ this.state.malt || 0 }
            onChange={ e => this.handleChange({malt: e.target.value}, this.notifyParent) }>
            { this.generateOptions('malt') }
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

Malt.markupTemplate = function() {
  return (<tr><th>Malts and Sugars</th><th>Qty</th><th>Remove</th></tr>);
}

Malt.dataTemplate = function() {
  return {malt: '', quantity: '', _destroy: false};
}
