import React from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    var value = this.props.value || '';

    this.state = {
      input: value,                   //what it shows on screen
      previous: value,                //the last known good value
      valid: this.props.valid(value)  //valid flag
    };
  }

  handleChange(e) {
    var value = e.target.value;
    var valid = this.props.valid(value);

    this.setState({
      input: value,
      valid: valid
    });

    //if (valid? || nothing?) && different?, then update
    if((valid || value.length == 0) && (value != this.state.previous)) {
      this.setState({ previous: value }, () => {
        this.props.fireChange(this.state.previous);
      });
    }
  }

  invalidColor() {
    if(!this.state.valid && this.state.input.length) {
      return {color: this.props.invalidColor || 'red'};
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.input !== nextState.input;
  }

  render() {
    return (
      <input
        id={ this.props.id }
        className={ this.props.className }
        onChange={ e => this.handleChange(e) }
        value={ this.state.input }
        style={ this.invalidColor() }>
      </input>
    );
  }
}
