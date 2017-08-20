import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import Ajax from '../lib/AjaxWrapper';
import Spinner from './Spinner';

export default class RecipeStyle extends React.Component {
  constructor(props) {
    super(props);
    this.generateOptions = this.generateOptions.bind(this);
    this.getStyleData = this.getStyleData.bind(this);

    this.state = {
      selected: this.props.selected,
      styleData: null
    }

    this.getStyleData(this.props.selected);
  }

  getStyleData(style) {
    Ajax.get(`/recipes/styles?style_id=${style}`, 'json', (data) => {
      this.setState({ styleData: data });
    });
  }

  generateOptions() {
    var options = [];

    for(let i = 0; i < this.props.styles.length; i++) {
      options.push(
        <option
          key={ i }
          value={ this.props.styles[i][1] }>
          { this.props.styles[i][0] }
        </option>
      );
    }

    return options;
  }

  handleChange(e) {
    var selected = e.target.value;

    this.setState({ selected: selected, styleData: null }, () => {
      this.props.parentCallback({ style: selected });
      this.getStyleData(selected);
    });
  }

  render() {
    return (
      <div>
        <select value={ this.state.selected } onChange={ (e) => this.handleChange(e) }>
          { this.generateOptions() }
        </select>
        { this.state.styleData ? <StyleStats style={ this.state.styleData } /> : <Spinner size='small' /> }
      </div>
    );
  }
}

class StyleStats extends React.Component {
  render() {
    return (
      <div className="style-stats">
        <strong>OG: </strong>
        <span>{ this.props.style.stats.og.low }</span>-
        <span>{ this.props.style.stats.og.high }</span>
        <strong> FG: </strong>
        <span>{ this.props.style.stats.fg.low }</span>-
        <span>{ this.props.style.stats.fg.high }</span>
        <strong> IBUs: </strong>
        <span>{ this.props.style.stats.ibu.low }</span>-
        <span>{ this.props.style.stats.ibu.high }</span>
        <strong> ABV: </strong>
        <span>{ this.props.style.stats.abv.low }</span>-
        <span>{ this.props.style.stats.abv.high }</span>%
      </div>
    );
  }
}
