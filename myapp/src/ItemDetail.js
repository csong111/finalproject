import React, { Component } from "react";
import UserAccountButton from "./page-elements.js/user-account-button.js";
import ArtistAccountButton from './page-elements.js/artist-account-button.js';
import NavButton from "./page-elements.js/nav-button.js";
import HomeButton from "./page-elements.js/home-button.js";
import CartButton from "./page-elements.js/cart-button.js";
import ConnectButton from "./page-elements.js/connect-button.js";
import SearchBar from "./page-elements.js/search-bar.js";
import { BrowserRouter, withRouter, Route, Link } from 'react-router-dom'
import './App.css';

class ItemDetail extends Component {
  constructor() {
    super();
    this.state = {
      itemID: "5afdb5c7f050e705bfccb99f",
      name: "",
      imageURL: "",
      blurb: "",
      artistName: "",
      price: ""
    };
  }

  //getItem details
  componentDidMount = () =>{
    fetch("/getItemDetails?itemID="+this.props.itemID, {
      method: 'GET',
    }).then(res=>res.text())
      .then(resB=>{
        let parsed=JSON.parse(resB);
        console.log(parsed)
        let name=parsed.name;
        let imageURL=parsed.imageURL;
        let blurb=parsed.blurb;
        let artistName=parsed.artistName;
        let price=parsed.price;
        this.setState({name: name, imageURL: imageURL, blurb: blurb, artistName: artistName, price: price})
    })
  }
  addToCart = (userID, itemID) => {
    let body=JSON.stringify({userID: this.props.userID, itemID: this.props.itemID, quantity: 1})
    fetch("/addToCart", {
      method: 'POST',
      body: body 
    }).then(res=>res.text())
      .then(resB=>{
        let parsed=JSON.parse(resB);
        console.log(parsed);
      })

  };

  render() {
      //fetch itemdetails from backend
    return (
      <div className="">
      <h1>LOGO</h1>
        <h1>ITEM DETAILS</h1>
        <NavButton />
        <HomeButton/>
        {this.props.email === "" ? null : <UserAccountButton userID={this.props.userID} />}
        {this.props.email === "" ? null : <CartButton userID = {this.props.userID} />}
        {this.props.email === "" ? <ConnectButton /> : null}
        <SearchBar />
        <img src={"/"+this.state.imageURL}/>
        <div>{this.state.name}</div>
        <div>{this.state.blurb}</div>
        Made by <Link to={"/artistprofile/"+this.state.artistName}>{this.state.artistName}</Link>
        <button onClick={this.addToCart}>Add to Cart</button>
      </div>      
    );
  }
}

export default ItemDetail;
