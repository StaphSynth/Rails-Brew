import React from 'react';
import Utils from '../lib/Utils';

export default class Ingredient extends React.Component {
  constructor(props) {
    super(props);
    this.notifyParent = this.notifyParent.bind(this);
    this.state = this.props.ingredient;
  }

  validateQty(qty) {
    return Utils.decimalNumberRegex().test(qty);
  }

  generateOptions(type) {
    var options = [<option key='0' value='0' hidden>{ 'Select a ' + type + '...' }</option>];
    var rawOptions = this.props.rawOptions;

    for(let i = 0; i < rawOptions.length; i++) {
      options.push(
        <option
          key={ i + 1 }
          value={ rawOptions[i][1] }>
          { rawOptions[i][0] }
        </option>
      );
    }

    return options;
  }

  //sets its own state, then updates the parent with
  //its new state and position via a packet object.
  //takes optional callback which is used to decide if the
  //parent needs to be updated with the new state or not.
  handleChange(change, callback) {
    callback = callback || function(){return true;};

    this.setState(change, () => {
      //only update the parent if required
      if(this.state._destroy || callback()) {
        let packet = {};
        packet.data = this.state;
        packet.position = this.props.position;
        this.props.parentCallback(packet);
      }
    });
  }
}
