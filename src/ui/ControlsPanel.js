import React from 'react';
import glamorous from 'glamorous';

import mediaqueries from './mediaqueries';

const ControlButton = glamorous.button({
  display: "block",
  width: "100%",
  backgroundColor: "#444",
  color: "lightblue",
  border: "1px solid silver",
  borderRadius: 3,
  fontSize: "inherit",
  padding: "6px 8px",

  [mediaqueries.desktop]: {
    // hover effects seem to glitch on iOS in Safari, so only activate them on desktop
    ":hover": {
      backgroundColor: "#EEE",
      color: "black",
      cursor: "pointer"
    }
  }
});

export default class ControlsPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRunning: props.sceneDriver.isRunning
    };

    this._handlePauseClick = this._handlePauseClick.bind(this);
    this._handleResumeClick = this._handleResumeClick.bind(this);
  }

  _handlePauseClick() {
    this.props.sceneDriver.stop();
    this.setState({
      isRunning: false
    });
  }

  _handleResumeClick() {
    this.props.sceneDriver.run();
    this.setState({
      isRunning: true
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isRunning
          ? <ControlButton onClick={this._handlePauseClick}>Pause</ControlButton>
          : <ControlButton onClick={this._handleResumeClick}>Resume</ControlButton>}
      </React.Fragment>
    );
  }
};
