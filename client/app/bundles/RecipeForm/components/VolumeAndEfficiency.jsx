import React from 'react';
import BrewCalc from '../lib/BrewCalcs';

export default class VolumeAndEfficiency extends React.Component {
  constructor(props) {
    super(props);
    var volume = this.props.volume;
    var userUnit = this.props.userPref.volume;

    this.state = {
      volume: BrewCalc.unitConverter['L'][userUnit](volume),
      validVolume: this.validVolume(volume),
      efficiency: this.props.efficiency,
      validEfficiency: this.validEfficiency(this.props.efficiency)
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

  updateVolume(e) {
    var volume = e.target.value;

    this.setState({
      volume: volume,
      validVolume: this.validVolume(volume)
    }, () => {
      if(this.state.validVolume) {
        let volInLitres = BrewCalc.unitConverter[this.props.userPref.volume]['L'](volume);
        this.props.parentCallback({ batch_volume: volInLitres });
      }
    });
  }

  updateEfficiency(e) {
    var efficiency = e.target.value;

    this.setState({
      efficiency: efficiency,
      validEfficiency: this.validEfficiency(efficiency)
    }, () => {
      if(this.state.validEfficiency)
        this.props.parentCallback({ efficiency: efficiency });
    });
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="volume">Batch Volume:</label>
          <input
            id="volume"
            onChange={ e => this.updateVolume(e) }
            value={ this.state.volume }
            style={ {color: this.state.validVolume ? 'inherit' : 'red'} }>
          </input>
          <span> { BrewCalc.unitSymbol[this.props.userPref.volume] }</span>
          <label htmlFor="lock">Lock ingredients to batch size</label>
          <input id="lock" type="checkbox"></input>
        </div>

        <div>
          <label htmlFor="efficiency">Efficiency:</label>
          <input
            id="efficiency"
            onChange={ e => this.updateEfficiency(e) }
            value={ this.state.efficiency }
            style={ {color: this.state.validEfficiency ? 'inherit' : 'red' } }>
          </input>
          <span> %</span>
        </div>
      </div>
    );
  }
}
