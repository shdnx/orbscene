import React from 'react';
import glamorous from 'glamorous';

import ControlsPanel from './ui/ControlsPanel';

import OrbSceneDriver from './orbscene';

const MainContainer = glamorous.div({
  display: "flex",
  height: "100%",
  backgroundColor: "#222",
  color: "#CCC"
});

const Sidebar = glamorous.div({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: 175,
  borderRight: "1px solid gray",
  padding: 6
});

const Title = glamorous.h1({
  display: "inline-block",
  margin: "0 5px",
  padding: 3,
  marginBottom: 15,
  letterSpacing: 2,
  color: "lightblue",
  borderBottom: "1px solid cyan"
});

const TitleHighlightedLetter = glamorous.span({
  letterSpacing: "inherit",
  font: "inherit",
  color: "deepskyblue"
});

const SidebarContent = glamorous.div({
  flexGrow: 1,
  margin: "15px 0"
});

const SidebarFooter = glamorous.div({
  fontSize: ".8em"
});

export default class App extends React.Component {
  static initialSceneSettings = {
    numOrbs: 200,
    connectionThreshold: 120
  };

  _canvasEl = null;
  _sceneDriver = null;

  state = {
    sidebarContent: "settings"
  };

  constructor(props) {
    super(props);

    this._updateCanvasSize = this._updateCanvasSize.bind(this);
  }

  _updateCanvasSize() {
    this._canvasEl.width = this._canvasEl.clientWidth;
    this._canvasEl.height = this._canvasEl.clientHeight;
  }

  componentDidMount() {
    this._updateCanvasSize();
    window.addEventListener("resize", this._updateCanvasSize);

    this._sceneDriver = new OrbSceneDriver(this._canvasEl, App.initialSceneSettings);
    this._sceneDriver.run();

    // we have to force a re-render, so that <ControlsPanel> can render - it needs to have this._sceneDriver initialized, but that's not possible yet for the first render(), since we don't have a ref yet (I think?)
    this.forceUpdate();
  }

  componentWillUnmount() {
    this._sceneDriver.stop();
    this._sceneDriver = null;

    window.removeEventListener("resize", this._updateCanvasSize);
  }

  render() {
    return (
      <MainContainer>
        <Sidebar>
          <Title>
            <TitleHighlightedLetter>O</TitleHighlightedLetter>rb<TitleHighlightedLetter>S</TitleHighlightedLetter>cene
          </Title>

          {this._sceneDriver && <ControlsPanel sceneDriver={this._sceneDriver} />}

          <SidebarContent>
            Content here
          </SidebarContent>

          <SidebarFooter>
            <p><a href="https://github.com/shdnx/orbscene">Source code</a></p>
            <p>Created by Gábor Kozár</p>
          </SidebarFooter>
        </Sidebar>

        <glamorous.Canvas innerRef={el => this._canvasEl = el} flexGrow={1}>
          This requires a reasonably recent browser with HTML5 &lt;canvas&gt; support.
        </glamorous.Canvas>
      </MainContainer>
    );
  }
};
