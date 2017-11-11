import React from 'react';

export default class StyleGuide extends React.Component {
  constructor(props) {
    super(props);

    this.generateStyleList = this.generateStyleList.bind(this);
  }

  generateStyleList() {
    let list = [];
    let styles = this.props.styles;

    styles.forEach((style, i) => {
      list.push(
        <Style
          key={ i }
          style={ style }>
        </Style>
      );
    });

    return list;
  }

  render() {
    return (
      <ul className="style-list">
        { this.generateStyleList() }
      </ul>
    );
  }
}

class Style extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCaret: false,
      showStyleData: false
    };
  }

  toggleCaret() {
    let caret = this.state.showCaret;
    this.setState({showCaret: !caret});
  }

  toggleStyleData() {
    let show = this.state.showStyleData;
    this.setState({showStyleData: !show});
  }

  render() {
    let buttonStyle = {
      border: 'none',
      backgroundColor: 'inherit',
      margin: '0.125em 0'
    };

    let style = this.props.style;

    return (
      <li className="style-item">
        <button
          style={ buttonStyle }
          onMouseEnter={ () => this.toggleCaret() }
          onMouseLeave={ () => this.toggleCaret() }
          onClick={ () => this.toggleStyleData() }>
          { style.name + ' '}
          {this.state.showCaret ? <span>&#x25BE;</span> : null}
        </button>
        { this.state.showStyleData ? <StyleData style={ style } /> : null }
      </li>
    );
  }
}

class StyleData extends React.Component {
  render() {
    let style = this.props.style;

    return (
      <div>
        <div>
          <p>
            <strong>Appearance: </strong>
            <span>{ style.appearance }</span>
          </p>
          <p>
            <strong>Aroma: </strong>
            <span>{ style.aroma }</span>
          </p>
          <p>
            <strong>Flavor: </strong>
            <span>{ style.flavor }</span>
          </p>
        </div>
      </div>
    );
  }
}
