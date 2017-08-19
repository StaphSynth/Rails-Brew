import PropTypes from 'prop-types';
import React from 'react';
import BrewCalc from '../brewCalcs';
import glass from '../img/glass_small.png';

export default class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { recipe: JSON.parse(this.props.recipe) };
  }

  render() {
    return (
      <RecipePrediction recipe={ this.state.recipe } />
    );
  }
}

class RecipePrediction extends React.Component {
  constructor(props) {
    super(props);
    var fg = this.props.recipe.FG || '0';
    var fgArray = BrewCalc.parseFg(fg);

    this.state = {
      fgActual: fg,              //the real fg value as string
      fgInput: fg,               //the fg value displayed in the field
      fgArray: fgArray,          //the parsed 'maths-friendly' version for calcs
      abv: BrewCalc.getAbv(this.props.recipe.OG, fgArray)
    }

  }

  updateCalcs() {
    var fgArray = BrewCalc.parseFg(this.state.fgActual);
    var abv = BrewCalc.getAbv(this.props.recipe.OG, fgArray);

    this.setState({
      fgArray: fgArray,
      abv: abv
    });
  }

  updateFg(e) {
    var fg = e.target.value;

    this.setState({ fgInput: fg });

    if(BrewCalc.validateFg(fg)) {
      this.setState({ fgActual: fg }, () => {
        this.updateCalcs();
      });
    }
  }

  render() {
    return (
      <div className="prediction-container">
        <div className="recipe-colour">
          { this.props.recipe.colour }
        </div>

        <div className="predictions">
          <div>
            <strong>OG: </strong><span className="og-display">{ this.props.recipe.OG }</span>
            <strong>FG: </strong><input id="FG" value={ this.state.fgInput } onChange={ (e) => this.updateFg(e) } />
          </div>

          <div>
            <strong>IBUs: </strong><span className="ibu-display">{ this.props.IBU }</span>
            <strong>SRM: </strong><span className="srm-display">{ this.props.recipe.colour }</span>
            <strong>ABV: </strong><span className="abv-display">{ this.state.abv }</span>%
          </div>
        </div>
      </div>
    );
  }
}
