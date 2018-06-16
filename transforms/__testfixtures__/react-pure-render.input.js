import React from "react";
import React, { Component } from "react";
import shouldPureComponentUpdate from "react-pure-render/function";

export class TestComponentA extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  render() {
    return null;
  }
}

export class TestComponentB extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  render() {
    return null;
  }
}
