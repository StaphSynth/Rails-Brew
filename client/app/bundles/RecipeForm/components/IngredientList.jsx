import React from 'react';
import Malt from './Malt';

export default class IngredientList extends React.Component {
  constructor(props) {
    super(props);
    this.generateList = this.generateList.bind(this);

    this.state = { ingredients: this.props.ingredients };
  }

  generateList() {
    let list = [];
    let Ingredient = this.getType();
    let tempValue;

    for(let i = 0; i < this.state.ingredients.length; i++) {
      //keep them in the list, but don't display them
      if(this.state.ingredients[i]._destroy)
        continue;

      tempValue = this.state.ingredients[i];
      //set a reference to its position in the list
      //so it can be used to modify state later
      tempValue.ref = i;

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

  getNewTemplate() {
    switch(this.props.type) {
      case 'malt':
        return { malt: '', quantity: '', _destroy: false };
      case 'hop':
        return;
      case 'yeast':
        return;
    }
  }

  //removes an ingredient item from the passed ingredients array
  //if that item is marked as _destroy: true && it does not have
  //an id (provided by the back end). Items with an id need to be
  //retained in the list so the back-end knows to remove them
  //from the DB on form submission
  filterDestroyedIngredients(ingredients) {
    return ingredients.filter(item => {
      return !(item._destroy && !item.id)
    });
  }

  createNewIngredient() {
    let currentList = this.state.ingredients;
    let newIngredient = this.getNewTemplate(currentList.length);
    currentList.push(newIngredient);

    this.setState({ ingredients: currentList });
  }

  handleChange(data) {
    let ingredients = this.state.ingredients;
    let refType = this.props.type + 's';

    //replace the old data value with the new one using the ref given in list generation
    ingredients[data.ref] = data;

    //check if the change is to destroy, if so filter the list
    if(data._destroy)
      ingredients = this.filterDestroyedIngredients(ingredients);

    this.setState({ ingredients: ingredients }, () => {
      let newState = {};
      newState[refType] = ingredients
      this.props.parentCallback(newState);
    });
  }

  render() {
    return (
      <div>
        <ul className={ this.props.type + '-inputs'}>
          { this.generateList() }
        </ul>
        <button onClick={ () => this.createNewIngredient() }>+</button>
      </div>
    );
  }
}
