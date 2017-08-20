import PropTypes from 'prop-types';
import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import RecipeMetaPanel from './RecipeMetaPanel';
import RecipeStyle from './RecipeStyle';
import Malt from './Malt';
import BatchVolume from './BatchVolume';

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

  handleChange(key, e) {
    var newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
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
          <input onChange={ e => this.handleChange('name', e) } value={ this.state.name } />
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

        <BatchVolume
          userPref={ this.props.userPref }
          volume={ this.props.batch_volume || this.props.userPref.default_batch_volume }
          parentCallback={ data => this.childCallback(data) }>
        </BatchVolume>

        <div className="method field">
          <label htmlFor="method">Method:</label>
          <textarea
            id="method"
            onChange={ e => this.handleChange('method', e) }
            value={ this.state.method }>
          </textarea>
        </div>

      </div>
    );
  }
}
