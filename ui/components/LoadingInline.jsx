import React from "react";

export default class LoadingInline extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    // Don't immediatelly show, short loading times don't need a spinner
    this.timeout = setTimeout(() => this.setState({ visible: true }), 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <div className={`loading-inline ${this.state.visible ? "visible" : ""}`}>
        <div>
          <div className="la-ball-beat la-dark">
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    );
  }
}
