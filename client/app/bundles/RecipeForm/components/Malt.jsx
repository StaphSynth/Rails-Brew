import React from 'react';
import Ingredient from './Ingredient';
import Input from './Input';
import BrewCalc from '../lib/BrewCalcs';

export default class Malt extends Ingredient {

  updateQty(value) {
    value = BrewCalc.unitConverter[this.props.userPref.weight_big]['M'](value);
    this.handleChange({quantity: value});
  }

  displayQty() {
    return BrewCalc.unitConverter['M'][this.props.userPref.weight_big](this.state.quantity);
  }

  getPercentContribution() {
    let malts = this.props.contribution.ingredients;
    let totalQty = 0;

    malts.forEach(malt => {
      if(malt._destroy) { return; }
      totalQty += malt.quantity;
    });

    return ((this.state.quantity / totalQty) * 100).toFixed(1);
  }

  render() {
    return (
      <tr>
        <td>
          <select
            id="malt"
            value={ this.state.handle || 0 }
            onChange={ e => this.handleChange({malt: e.target.value}) }>
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
        </td>

        <td>
          { this.getPercentContribution.bind(this)() }
        </td>

        <td>
          <button onClick={ e => this.handleChange({_destroy: true}) }>x</button>
        </td>
      </tr>
    );
  }
}

Malt.markupTemplate = function(userPref) {
  return (
    <tr>
      <th>Malts and Sugars</th>
      <th>Quantity ({ BrewCalc.unitSymbol[userPref.weight_big] })</th>
      <th>%</th>
      <th>Remove</th>
    </tr>
  );
}

Malt.dataTemplate = function() {
  return {malt: '', quantity: '', _destroy: false};
}
