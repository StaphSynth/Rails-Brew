import React from 'react';
import BrewCalc from '../lib/BrewCalcs';

export default class BatchVolume extends React.Component {
  constructor(props) {
    super(props);
    var volume = this.props.volume;
    var userUnit = this.props.userPref.volume;

    this.state = {
      volume: BrewCalc.unitConverter['L'][userUnit](volume)
    };
  }

  updateVolume(e) {
    var volume = e.target.value;
    console.log(volume);
    //convert to L before sending to the parent for storage in DB
    var volInLitres = BrewCalc.unitConverter[this.props.userPref.volume]['L'](volume);

    this.setState({ volume: volume }, () => {
      this.props.parentCallback({ batch_volume: volInLitres });
    });
  }

  render() {
    return (
      <div>
        <strong>Batch Volume: </strong>
        <input onChange={ (e) => this.updateVolume(e) } value={ this.state.volume } />
        <span> { BrewCalc.units[this.props.userPref.volume] }</span>
        <label htmlFor="lock">Lock ingredients to batch size</label>
        <input id="lock" type="checkbox"></input>
      </div>
    );
  }
}
