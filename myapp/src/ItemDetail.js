import React, { Component } from "react";
import UserAccountButton from "./page-elements.js/user-account-button.js";
import ArtistAccountButton from './page-elements.js/artist-account-button.js';
import NavButton from "./page-elements.js/nav-button.js";
import CartButton from "./page-elements.js/cart-button.js";
import ConnectButton from "./page-elements.js/connect-button.js";
import SearchBar from "./page-elements.js/search-bar.js";
import { BrowserRouter, withRouter, Route, Link } from 'react-router-dom'
import './App.css';

class ItemDetail extends Component {
  constructor() {
    super();
    this.state = {
      itemID: "",
      imageURL: "",
      blurb: "",
      artistName: "",
      price: ""
    };
  }
  addToCart = itemID => {
    //fetch addtocart

  };
  seeArtistInfo = artistName => {
    //fetch getartistdetails
  };

  render() {
      //fetch itemdetails from backend
    return (
      <div className="">
        <h1>ITEM DETAILS</h1>
        <NavButton />
        {this.props.email === "" ? null : <UserAccountButton />}
        {this.props.email === "" ? null : <CartButton />}
        {this.props.email === "" ? <ConnectButton /> : null}
        <SearchBar />
      </div>
    );
  }
}

export default ItemDetail;
