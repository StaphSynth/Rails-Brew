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

  //sets its own state, then updates the parent with
  //its new state and position via a packet object
  handleChange(key, value) {
    let newState = {};
    newState[key] = value;

    this.setState(newState, () => {
      let packet = {};
      packet.data = this.state;
      packet.position = this.props.position;
      this.props.parentCallback(packet);
    });
  }
}
