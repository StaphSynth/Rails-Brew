import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import glass from '../img/glass_small.png';
import Input from './Input';

export default class RecipeMetaPanel extends React.Component {
  valid(value) {
    return BrewCalc.validateFg(value) && this.props.recipe.OG > value;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.recipe.IBU !== nextProps.recipe.IBU ||
      this.props.recipe.OG !== nextProps.recipe.OG ||
      this.props.recipe.FG !== nextProps.recipe.FG ||
      this.props.recipe.colour !== nextProps.recipe.colour ||
      this.props.recipe.abv !== nextProps.recipe.abv ||
      this.props.recipe.efficiency !== nextProps.recipe.efficiency
    );
  }

  render() {
    return (
      <div className="prediction-container">
        <div className="recipe-colour">
          <img
            src={ glass }
            style={ {backgroundColor: BrewCalc.srmToHex(this.props.recipe.colour)} }>
          </img>
        </div>

        <div className="predictions">
          <div>
            <strong>OG: </strong><span className="og-display">{ this.props.recipe.OG }</span>
            <strong>FG: </strong>
            <Input
              id="FG"
              className="fg-model"
              value={ this.props.recipe.FG || '0' }
              fireChange={ v => this.props.parentCallback({FG: v}) }
              valid={ v => this.valid(v) }
              title="You may enter up to two gravity values, separated by a '-'. Eg: 1.009-1.012">
            </Input>
          </div>

          <div>
            <strong>IBUs: </strong><span className="ibu-display">{ this.props.recipe.IBU }</span>
            <strong>SRM: </strong><span className="srm-display">{ this.props.recipe.colour }</span>
            <strong>ABV: </strong><span className="abv-display">{ this.props.recipe.abv }</span>%
          </div>
        </div>
      </div>
    );
  }
}
