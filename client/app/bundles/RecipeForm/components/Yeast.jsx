import React from 'react';
import Ingredient from './Ingredient';

export default class Yeast extends Ingredient {

  notifyParent() {
    return true;
  }

  render() {
    return (
      <tr>
        <td>
          <select
            value={ this.state.handle || '0' }
            onChange={ e => this.handleChange({yeast: e.target.value}) }>
            { this.generateOptions('yeast') }
          </select>
        </td>
      </tr>
    );
  }
}

Yeast.markupTemplate = function() {
  return (<tr><th>Yeast</th></tr>);
}

Yeast.dataTemplate = function() {
  return {yeast: ''};
}
