import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import glass from '../img/glass_small.png';

export default class RecipeMetaPanel extends React.Component {
  constructor(props) {
    super(props);
    var fg = this.props.recipe.FG || '0';

    this.state = {
      fgPrevious: fg,  //the last known good fg value
      fgInput: fg,     //the fg value displayed in the field
      fgValid: true
    }
  }

  //updates the state with a new valid FG value is entered
  //passes the new FG value up to the parent RecipeForm Component
  updateFg(e) {
    var fg = e.target.value;
    var valid = BrewCalc.validateFg(fg) && (this.props.recipe.OG > fg);

    this.setState({
      fgInput: fg,
      fgValid: valid
    });

    fg = fg.trim();

    //is it (valid? || zero?) && different? then update
    if((valid || fg.length == 0) && fg != this.state.fgPrevious) {
      this.setState({ fgPrevious: fg }, () => {
        this.props.parentCallback({FG: fg});
      });
    }
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
            <input
              id="FG"
              className="fg-model"
              value={ this.state.fgInput }
              onChange={ (e) => this.updateFg(e) }
              title="You may enter up to two gravity values, separated by a '-'. Eg: 1.009-1.012"
              style={ {color: this.state.fgValid ? 'inherit' : 'red'} }>
            </input>
          </div>

          <div>
            <strong>IBUs: </strong><span className="ibu-display">{ this.props.IBU }</span>
            <strong>SRM: </strong><span className="srm-display">{ this.props.recipe.colour }</span>
            <strong>ABV: </strong><span className="abv-display">{ this.props.recipe.abv }</span>%
          </div>
        </div>
      </div>
    );
  }
}
