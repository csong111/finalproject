import React, { Component } from "react";
import { BrowserRouter, withRouter, Route, Link } from "react-router-dom";
import "../App.css";

class LogOutButton extends Component {
  logout = () => {
    window.location.reload();
  };
  render() {
    return (
      <div>
        <button className="noButton" onClick={this.logout}>
          {/* <img width="30px" src='../useracct.png' className="icon"/> */}
          <div className="connect">
          <span className="bold">LOG OUT</span>
          </div>
        </button>
      </div>
    );
  }
}

export default LogOutButton;