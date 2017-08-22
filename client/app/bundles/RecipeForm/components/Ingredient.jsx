import React from 'react';

export default class Ingredient extends React.Component {
  constructor(props) {
    super(props);
  }

  generateOptions() {
    var options = [];
    var rawOptions = this.props.rawOptions;

    for(let i = 0; i < rawOptions.length; i++) {
      options.push(
        <option
          key={ i }
          value={ rawOptions[i][1] }>
          { rawOptions[i][0] }
        </option>
      );
    }

    return options;
  }

  handleChange(key, value) {
    var newState = {};
    newState[key] = value;

    this.setState(newState, () => {
      this.props.parentCallback(this.state);
    });
  }

  render() {
    return (
      <div>
        <select>
          { this.generateOptions() }
        </select>
      </div>
    );
  }
}
