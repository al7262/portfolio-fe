import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer';
import CartList from '../components/CartList';

class Cart extends React.Component{
    componentDidMount = async () => {
        await this.props.checkLoginStatus();
        await this.props.getCategory();
        console.log(JSON.parse(localStorage.getItem('cart')))
    }

    render(){
        const cart = JSON.parse(localStorage.getItem('cart'));
        let dataToShow;
        if(Array.isArray(cart)&&cart.length>0){
            console.log('inside if')
            dataToShow = cart.map((item,key)=>{
                return(
                    <CartList
                        key={key}
                        index={key}
                        name={item.data.name}
                        image={item.data.image}
                        price={item.data.price}
                        qty={item.qty}
                        deleteFromCart={this.props.deleteFromCart}/>
                )
            })
        } else {
            dataToShow = <div className="row col-md-12 nothing-in-cart"><h1>There is nothing in Cart.</h1></div>
        }
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>Shopping Cart</h1>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <div className="container mb-5">
                                {dataToShow}
                            </div>
                            <div className="row col-md-12 justify-content-center">
                                <div className="cart-button">
                                    <Link className="btn btn-danger btn-clear" onClick={()=>localStorage.removeItem('cart')}>Clear Cart</Link>
                                    <Link className="btn btn-danger btn-checkout">Check Out</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect('categoryList', actions)(withRouter(Cart))