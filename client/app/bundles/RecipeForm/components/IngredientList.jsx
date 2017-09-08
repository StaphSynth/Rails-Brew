import React from 'react';
import Malt from './Malt';
import Hop from './Hop';
import Yeast from './Yeast';
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
    let contributions = this.props.contributions;
    let ingredients = this.state.ingredients;

    for(let i = 0; i < ingredients.length; i++) {
      //keep them in the list, but don't display them
      if(ingredients[i]._destroy) { continue; }

      list.push(
        <Ingredient
          key={ i }
          position={ i }
          ingredient={ ingredients[i] }
          rawOptions={ this.props.rawOptions }
          userPref={ this.props.userPref }
          contribution={ contributions ? contributions[ingredients[i].handle] : null }
          parentCallback={ packet => this.handleChange(packet) }>
        </Ingredient>
      );
    }
    return list;
  }

  getType() {
    switch(this.props.type) {
      case 'malt':
        return Malt;
      case 'yeast':
        return Yeast;
      case 'hop':
        return Hop;
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

  createButton() {
    if(this.props.type !== 'yeast') {
      return (<button onClick={ () => this.createNewIngredient() }>+</button>);
    }
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            { this.getType().markupTemplate(this.props.userPref) }
          </thead>
          <tbody>
            { this.generateList() }
          </tbody>
        </table>
        { this.createButton() }
      </div>
    );
  }
}
