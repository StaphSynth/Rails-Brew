import React from 'react';
import BrewCalc from '../lib/BrewCalcs';
import Input from './Input';

export default class VolumeAndEfficiency extends React.Component {
  constructor(props) {
    super(props);

    let volume = this.props.volume;
    this.state = {
      volumeActual: volume, //the real value in SI units
      volumeDisplay: BrewCalc.unitConverter['L'][this.props.userPref.volume](volume), //in the user's units
      efficiency: this.props.efficiency,
    };
  }

  decimalNumberRegex(){
    return /^[0-9]+(\.[0-9]+)?$/;
  }

  validEfficiency(efficiency) {
    return this.decimalNumberRegex().test(efficiency)
      && efficiency < 100 && efficiency > 0;
  }

  validVolume(volume) {
    return this.decimalNumberRegex().test(volume);
  }

  handleChange(change) {
    this.setState(change, () => {
      this.props.parentCallback(change);
    });
  }

  updateVolume(volumeDisplay) {
    this.setState({volumeDisplay: volumeDisplay}, () => {
      //convert volume back to SI units before calling parent
      let volumeActual = BrewCalc.unitConverter[this.props.userPref.volume]['L'](volumeDisplay);
      this.handleChange({batch_volume: volumeActual});
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="volume">Batch Volume:</label>
          <Input
            id="volume"
            fireChange={ v => this.updateVolume(parseFloat(v) || 0) }
            valid={ v => this.validVolume(v) }
            value={ this.state.volumeDisplay }>
          </Input>
          <span>
            { BrewCalc.unitSymbol[this.props.userPref.volume] }
          </span>
          <label htmlFor="lock">Lock ingredients to batch size</label>
          <input id="lock" type="checkbox"></input>
        </div>

        <div>
          <label htmlFor="efficiency">Efficiency:</label>
          <Input
            id="efficiency"
            fireChange={ v => this.handleChange({efficiency: parseFloat(v) || 0}) }
            value={ this.state.efficiency }
            valid={ v => this.validEfficiency(v) }>
          </Input>
          <span> %</span>
        </div>
      </div>
    );
  }
}
