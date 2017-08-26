import React from 'react';
import Malt from './Malt';
import update from 'immutability-helper';

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
          parentCallback={ packet => this.handleChange(packet) }>
        </Ingredient>
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

  //removes an ingredient item from the passed ingredients array
  //if that item is marked as _destroy: true && it does not have
  //an id (provided by the back end). Items with an id need to be
  //retained in the list so the back-end knows to remove them
  //from the DB on form submission
  filterDestroyedIngredients(ingredients) {
    return ingredients.filter(item => {
      return !(item._destroy && !item.id);
    });
  }

  createNewIngredient() {
    let newIngredient = this.getType().dataTemplate();
    //use concat rather than push so as not to mutate the current state
    let ingredients = this.state.ingredients.concat(newIngredient);

    this.setState({ingredients: ingredients});
  }

  handleChange(packet) {
    let ingredientType = this.props.type + 's';
    let ingredients = this.state.ingredients;
    //replace the old data value with the new one
    //using the position ref given in list generation
    ingredients = update(ingredients, {$splice: [[packet.position, 1, packet.data]]});
    //check if the change is to destroy, if so filter the list
    if(packet.data._destroy) {
      ingredients = update(ingredients, {$set: this.filterDestroyedIngredients(ingredients)});
    }

    this.setState({ingredients: ingredients}, () => {
      let packet = {};
      packet[ingredientType] = this.state.ingredients;
      this.props.parentCallback(packet);
    });
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            { this.getType().markupTemplate() }
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
