import PropTypes from 'prop-types';
import React from 'react';
import BrewCalc from '../brewCalcs';
import RecipeMetaPanel from './RecipeMetaPanel';

export default class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    var recipe = JSON.parse(this.props.recipe);
    recipe.fgArray = BrewCalc.parseFg(recipe.FG || '0');
    recipe.abv = BrewCalc.getAbv(recipe.OG, recipe.fgArray);

    this.state = recipe;
  }

  //sets state with updates sent from child Components,
  //then updates prediction calcs
  childCallback(data = {}) {
    this.setState(data, () => this.updateCalcs());
  }

  updateCalcs() {
    var fgArray = BrewCalc.parseFg(this.state.FG || '0');
    var abv = BrewCalc.getAbv(this.state.OG, fgArray);

    this.setState({
      fgArray: fgArray,
      abv: abv
    });
  }

  render() {
    return (
      <RecipeMetaPanel recipe={ this.state } parentCallback={ (data) => this.childCallback(data) } />
    );
  }
}
