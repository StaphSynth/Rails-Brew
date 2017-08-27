import PropTypes from 'prop-types';
import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import RecipeMetaPanel from './RecipeMetaPanel';
import RecipeStyle from './RecipeStyle';
import Malt from './Malt';
import VolumeAndEfficiency from './VolumeAndEfficiency';
import IngredientList from './IngredientList';

export default class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    var recipe = JSON.parse(this.props.recipe);
    recipe.fgArray = BrewCalc.parseFg(recipe.FG || '0');
    recipe.abv = BrewCalc.getAbv(recipe.OG, recipe.fgArray);
    recipe.malts = this.props.malts || [];
    recipe.hops = this.props.hops || [];
    recipe.yeasts = this.props.yeasts || [];

    this.state = recipe;
  }

  //handles state changes provided by child components,
  //then updates prediction calcs.
  childCallback(data = {}) {
    //should put some logic in the decision to run updateCalcs.
    this.setState(data, () => this.updateCalcs());
  }

  //handles interanal state changes
  handleChange(change) {
    this.setState(change);
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
      <div>

        <div>
          <label htmlFor="name">Recipe Name:</label>
          <input
            id="name"
            onChange={ e => this.handleChange({name: e.target.value}) }
            value={ this.state.name }>
          </input>
        </div>

        <RecipeStyle
          styles={ this.props.styles }
          selected={ this.state.style }
          parentCallback={ data => this.childCallback(data) }>
        </RecipeStyle>

        <RecipeMetaPanel
          recipe={ this.state }
          parentCallback={ data => this.childCallback(data) }>
        </RecipeMetaPanel>

        <VolumeAndEfficiency
          userPref={ this.props.userPref }
          volume={ this.props.batch_volume || this.props.userPref.default_batch_volume }
          efficiency={ this.props.efficiency || this.props.userPref.default_efficiency }
          parentCallback={ data => this.childCallback(data) }>
        </VolumeAndEfficiency>

        <br />

        <IngredientList
          type='malt'
          ingredients={ this.state.malts }
          rawOptions={ this.props.ingredientOptions.malts }
          parentCallback={ data => this.childCallback(data) }
          userPref={ this.props.userPref }>
        </IngredientList>

        <br />

        <IngredientList
          type='hop'
          ingredients={ this.state.hops }
          rawOptions={ this.props.ingredientOptions.hops }
          parentCallback={ data => this.childCallback(data) }
          userPref={ this.props.userPref }>
        </IngredientList>

        <br />

        <IngredientList
          type='yeast'
          ingredients={ this.state.yeasts }
          rawOptions={ this.props.ingredientOptions.yeasts }
          parentCallback={ data => this.childCallback(data) }>
        </IngredientList>

        <br />

        <div className="method field">
          <label htmlFor="method">Method:</label>
          <textarea
            id="method"
            onChange={ e => this.handleChange({method: e.target.value}) }
            value={ this.state.method }>
          </textarea>
        </div>

      </div>
    );
  }
}
