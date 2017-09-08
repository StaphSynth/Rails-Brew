import React from 'react';

export default class Spinner extends React.Component {
  render() {
    return (<div className={ 'spinner spinner-' + this.props.size }></div>);
  }
}
