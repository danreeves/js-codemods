import React from "react";
import React, { PureComponent } from "react";

export class TestComponentA extends React.PureComponent {
  render() {
    return null;
  }
}

export class TestComponentB extends PureComponent {
  render() {
    return null;
  }
}

export function createComponent() {
  return class TestComponentC extends PureComponent {
    render() {
      return null;
    }
  };
}

export class TestComponentD extends PureComponent {
  render() {
    return null;
  }
}
