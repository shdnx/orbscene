import React, { Component } from 'react';
import glamorous from 'glamorous';

const MainContainer = glamorous.div({
  display: "flex",
  height: "100%",
  backgroundColor: "#222",
  color: "#CCC"
});

const Sidebar = glamorous.div({
  height: "100%",
  width: 150,
  borderRight: "1px solid gray"
});

const Title = glamorous.h1({
  display: "inline-block",
  margin: 0,
  marginLeft: 15,
  letterSpacing: 2,
  color: "lightblue"
});

const TitleHighlightedLetter = glamorous.span({
  letterSpacing: "inherit",
  font: "inherit",
  color: "deepskyblue"
});

export default class App extends Component {
  _canvasEl = null
  state = {
    sidebarContent: "settings"
  }

  componentDidMount() {
    // TODO: start scene
  }

  componentWillUnmount() {
    // TODO: stop scene
  }

  render() {
    return (
      <MainContainer>
        <Sidebar>
          <Title>
            <TitleHighlightedLetter>O</TitleHighlightedLetter>rb<TitleHighlightedLetter>S</TitleHighlightedLetter>cene
          </Title>
        </Sidebar>

        <glamorous.canvas innerRef={el => this._canvasEl = el} flexGrow={1}>
          This requires a reasonably new browser with HTML5 &lt;canvas&gt; support.
        </glamorous.canvas>
      </MainContainer>
    );
  }
};
