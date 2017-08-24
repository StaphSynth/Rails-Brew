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

    for(let i = 0; i < this.state.ingredients.length; i++) {
      //keep them in the list, but don't display them
      if(this.state.ingredients[i]._destroy)
        continue;

      list.push(
        <Ingredient
          key={ i }
          position={ i }
          ingredient={ this.state.ingredients[i] }
          rawOptions={ this.props.rawOptions }
          userPref={ this.props.userPref }
          parentCallback={ packet => this.handleChange(packet) }
        />
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

  getTableHeader() {
    switch(this.props.type) {
      case 'malt':
        return <tr><th>Malts and Sugars</th><th>Qty</th><th>Remove</th></tr>;
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

  handleChange(packet) {
    let ingredients = this.state.ingredients;
    let typeReference = this.props.type + 's';

    //replace the old data value with the new one
    //using the position ref given in list generation
    ingredients[packet.position] = packet.data;

    //check if the change is to destroy, if so filter the list
    if(packet.data._destroy)
      ingredients = this.filterDestroyedIngredients(ingredients);

    this.setState({ ingredients: ingredients }, () => {
      let newState = {};
      newState[typeReference] = ingredients;
      this.props.parentCallback(newState);
    });
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            { this.getTableHeader() }
          </thead>
          <tbody>
            { this.generateList() }
          </tbody>
        </table>
        <button onClick={ () => this.createNewIngredient() }>+</button>
      </div>
    );
  }
}
