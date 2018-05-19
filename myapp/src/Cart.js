import React, { Component } from "react";
import UserAccountButton from "./page-elements.js/user-account-button.js";
import ArtistAccountButton from "./page-elements.js/artist-account-button.js";
import NavButton from "./page-elements.js/nav-button.js";
import HomeButton from "./page-elements.js/home-button.js";
import CartButton from "./page-elements.js/cart-button.js";
import ConnectButton from "./page-elements.js/connect-button.js";
import SearchBar from "./page-elements.js/search-bar.js";
import { BrowserRouter, withRouter, Route, Link } from "react-router-dom";
import Stripe from "./Stripe.js";
import "./App.css";

class Cart extends Component {
  constructor() {
    super();
    this.state = {

      // Inner
      showCheckout: false,


      // UserDetails
      firstName: "Jen",
      lastName: "O",
      email: "jen@email.com",
      address: "123 Blah St.",
      city: "Montreal",
      province: "Quebec",
      postalCode: "H13 1Y8",
      country: "Canada",

      // Cart
      cartItems: [
        {
          itemID: "123458",
          name: "Pillow",
          price: 100,
          artistName: "caro",
          imageURL: "items/pillow.jpg",
          cat: "Popular",
          quantity: 2,
          quantityToBuy: 1,
        }
      ]

    };    
  }   

  //do a fetch to getCart  and  then setState with the items.
  //getUser details to prepopulate the shipping info.
  componentDidMount() {
    var body = {
      userID : this.props.userID
    }
    //console.log("getCart-1",body)
    fetch("/getCart", {
      method: "POST",
      body : JSON.stringify(body)
    })
    .then(e => e.text())
    .then(e => {
      let parsed=JSON.parse(e)
      this.setState({cartItems: parsed});
      console.log(this.state.cartItems)
      this.getUserDetails();

    })
    // getCartItemDetails = async items => {
    //   let responses = await Promise.all(
    //     this.state.cartItems.map(item=>
    //       fetch("getItemDetails?itemID="+item.itemID, {
    //         method: "GET",
    //       }).then(res=>res.text())
    //         .then(resB=>{
    //           let parsed=JSON.parse(resB)
    //           return parsed;
    //         })
    //   )); this.setState({cartItems: responses})
    // } 
    
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
  

    var self = this;
    window.paypal.Button.render(
      {
        env: "sandbox",

        client: {
          sandbox:
            "ARwoGJ_sUwvA4yVX-fyaodG5lm0U1JqrsAhz5tk43xTgeL7C-kUgaAg1yFfZEJWi3o0qUq2Y__He2lTi"
        },

        commit: true, // Show a 'Pay Now' button

        payment: (data, actions) => {
          return actions.payment.create({
            payment: {
              transactions: [
                {
                  amount: { total: this.state.total, currency: "CAD" }
                }
              ]
            }
          });
        },

        onAuthorize: function(data, actions) {
          return actions.payment.execute().then(function(payment) {
            // The payment is complete!
            // You can now show a confirmation message to the customer
            //console.log(payment);
            self.buy();
          });
        }
      },
      "#paypal-button"
    );
  }

  getUserDetails = () => {
    var body = {
      userID : this.props.userID
    }
    //console.log("getUserDetails-1",body)
    fetch("/getUserDetails", {
      method: "POST",
      body : JSON.stringify(body)
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    //.then(e=>{console.log("getUserDetails-4",e);return e})
    .then(e => {
      this.setState({ 
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        address: e.address,
        city: e.city,
        province: e.province,
        postalCode: e.postalCode,
        country: e.country,
      });
    });
  };

  buy = () => {
    // addTransaction
    var body = JSON.stringify({
      // Shipping Infos
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      address: this.state.address,
      city: this.state.city,
      province: this.state.province,
      postalCode: this.state.postalCode,
      country: this.state.country,
      // userID
      userID : this.props.userID,
      // transactions
      cartItems : this.state.cartItems,
    })
    //console.log("createTransaction-1",body)
    fetch("/createTransaction", {
      method: "POST",
      body : body
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    //.then(e=>{console.log("createTransaction-4",e);return e})
    .then(e => {
      // @++ Error in props settings, watchout! see checkOutComplete at componentDidMount // double insertion
      this.props.history.push("/checkoutcomplete/" + e.transactionID, {cartItems: this.state.cartItems})
    });
  };

  //fetch to remove the item from cart
  removeItem = tempCartItems => {
    // 1) See&correct business logic
    // 2) Figure how I'm going to change things in the database
    // 3) Define what you send
    // 4) Define What you receive
    // 5) Go on back end, and rewrite the logic
    // 6) Test it & look at the consolelog
    // 7) Define backEndLogic as pseudoCode

    // // 1)
      // Go through cartItems array and remove the object that contains the itemID we want to remove
      //
        // resetFront State ()
    var body = {
      // userID
      userID : this.props.userID,
      // transactions
      cartItems : tempCartItems,
    }
    //console.log("removeItem-1",body)
    fetch("/removeItem", {
      method: "POST",
      body : JSON.stringify(body)
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    //.then(e=>{console.log("removeItem-4",e);return e})
    .then(e => {
      this.setState({
        cartItems : e.cartItems,
      })
    });
  };
  updateQuantity = qty => {
    // 1) See&correct business logic
    // 2) Figure how I'm going to change things in the database
    // 3) Define what you send
    // 4) Define What you receive
    // 5) Go on back end, and rewrite the logic
    // 6) Test it & look at the consolelog
    // 7) Define backEndLogic as pseudoCode
    var body = {
      // userID
      userID : this.props.userID,
      // transactions
      cartItems : this.state.cartItems,
    }
    //console.log("updateQuantity-1",body)
    fetch("/updateQuantity", {
      method: "POST",
      body : JSON.stringify(body)
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    //.then(e=>{console.log("updateQuantity-4",e);return e})
    .then(e => {
      this.setState({
        cartItems : e.cartItems,
      })
    });
  };

  render() {
    //console.log(this.state.total)
    let total = 0;
    let cartItems = this.state.cartItems.map((item, id) => {
      total += parseInt(item.price) * parseInt(item.quantityToBuy);
      return (
        <div key={id}>
          <img src={"/" + item.imageURL} />
          <br />
          {item.name}
          <br />
          {item.artistName}
          <br />
          Price: {item.price}
          <br />
          <input
            type="text"
            onChange={e => {
              if (e.target.value <= item.quantity) {
                var temp = JSON.parse(JSON.stringify(this.state.cartItems));
                temp[id].quantityToBuy = e.target.value;
                this.setState({ cartItems: temp });
              }
            }}
            value={item.quantityToBuy}
            placeholder={item.quantity + " in stock"}
          />
          <button onClick={this.updateQuantity}>Update Quantity</button>
          <button onClick={()=>{
            var temp = JSON.parse(JSON.stringify(this.state.cartItems));
            temp = temp.filter((EL,ID)=> ID!==id)
            this.removeItem(temp)
          }}>Remove Item</button>
        </div>
      );
    });
    return (
      <div className="App">
        <HomeButton />
        <NavButton />
        {this.props.email !== "" ? <UserAccountButton userID={this.props.userID} /> : null}
        {this.props.artistName !== "" ? <ArtistAccountButton artistName={this.props.artistName} /> : null}
        {this.props.email == "" || this.props.artistName == "" ? (
          <ConnectButton />
        ) : null}
        {this.props.email !== "" ? <CartButton  userID = {this.props.userID}/> : null}
        <h1>CART</h1>
        <div>{cartItems}</div>
        <div>Total: ${total}</div>
        <button
          onClick={e => {
            this.setState({ showCheckout: true, total: total });
          }}
        >
          Checkout Now
        </button>

        <div
          style={
            this.state.showCheckout
              ? { display: "inline" }
              : { display: "none" }
          }
        >
          <div>Enter Shipping Info</div>
          <form>
            First Name:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ firstName: e.target.value });
              }}
              value={this.state.firstName}
              placeholder="First Name"
              required
            />
            <br />
            Last Name:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ lastName: e.target.value });
              }}
              value={this.state.lastName}
              placeholder="Last Name"
              required
            />
            <br />
            Email:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
              value={this.state.email}
              placeholder="Email"
              required
            />
            <br />
            Address:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ address: e.target.value });
              }}
              value={this.state.email}
              placeholder="Address"
              required
            />
            <br />
            City:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ city: e.target.value });
              }}
              value={this.state.city}
              placeholder="City"
              required
            />
            <br />
            Province:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ province: e.target.value });
              }}
              value={this.state.province}
              placeholder="Province"
              required
            />
            <br />
            Postal Code:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ postalCode: e.target.value });
              }}
              value={this.state.postalCode}
              placeholder="Postal Code"
              required
            />
            <br />
            Country:{" "}
            <input
              type="text"
              onChange={e => {
                this.setState({ country: e.target.value });
              }}
              value={this.state.country}
              placeholder="Country"
              required
            />
            <br />
            <div id="paypal-button" />
            <Stripe />
          </form>
        </div>
      </div>
    );
  }
}

let Content = withRouter(Cart);
export default Content;
