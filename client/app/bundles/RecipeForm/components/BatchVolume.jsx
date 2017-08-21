import React from 'react';
import BrewCalc from '../lib/BrewCalcs';

export default class BatchVolume extends React.Component {
  constructor(props) {
    super(props);
    var volume = this.props.volume;
    var userUnit = this.props.userPref.volume;

    this.state = {
      volume: BrewCalc.unitConverter['L'][userUnit](volume),
      valid: this.validVolume(volume)
    };
  }

  validVolume(volume) {
    return /^[0-9]+(\.[0-9]+)?$/.test(volume);
  }

  updateVolume(e) {
    var volume = e.target.value;

    this.setState({
      volume: volume,
      valid: this.validVolume(volume)
    }, () => {
      if(this.state.valid) {
        let volInLitres = BrewCalc.unitConverter[this.props.userPref.volume]['L'](volume);
        this.props.parentCallback({ batch_volume: volInLitres });
      }
    });
  }

  render() {
    return (
      <div>
        <strong>Batch Volume: </strong>
        <input
          onChange={ e => this.updateVolume(e) }
          value={ this.state.volume }
          style={ {color: this.state.valid ? 'inherit' : 'red'} }>
        </input>
        <span> { BrewCalc.unitSymbol[this.props.userPref.volume] }</span>
        <label htmlFor="lock">Lock ingredients to batch size</label>
        <input id="lock" type="checkbox"></input>
      </div>
    );
  }
}
