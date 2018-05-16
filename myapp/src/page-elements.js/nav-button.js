import React, { Component } from 'react';
import { BrowserRouter, withRouter, Route, Link } from 'react-router-dom'
import '../App.css';

class NavButton extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    bring = (event) => {
      event.preventDefault();
      this.props.history.push("/nav")
    }
  render() {
    return (
      <div className="">
        <button className="noButton" onClick={this.bring}><img src='../nav.png' className="icon"/></button>
      </div>
    );
  }
}

let navB=withRouter(NavButton);
export default navB;