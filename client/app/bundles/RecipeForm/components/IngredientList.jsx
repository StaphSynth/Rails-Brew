import React from 'react';
import Malt from './Malt';

export default class IngredientList extends React.Component {
  constructor(props) {
    super(props);
    this.generateList = this.generateList.bind(this);
  }

  generateList() {
    let list = [];
    let Ingredient = this.getType();
    let tempValue;

    for(let i = 0; i < this.props.ingredients.length; i++) {
      tempValue = this.props.ingredients[i];
      tempValue.ref = i; //set a reference so it can be used to modify state later

      list.push(
        <li key={ i }>
          <Ingredient
            ingredient={ tempValue }
            rawOptions={ this.props.rawOptions }
            parentCallback={ data => this.handleChange(data) }
          />
        </li>
      );
    }
    return list;
  }

  getType() {
    let Ingredient;

    switch(this.props.type) {
      case 'malt':
        return Ingredient = Malt;
      case 'yeast':
        return;
      case 'hop':
        return;
    }
  }

  handleChange(data) {
    let ingredients = this.props.ingredients;
    let refType = this.props.type + 's';
    //replace the old data value with the new one using the ref given in list generation
    ingredients[data.ref] = data;
    this.props.parentCallback({ refType: ingredients });
  }

  render() {
    return (
      <ul className={ this.props.type + '-inputs'}>
        { this.generateList() }
      </ul>
    );
  }
}
