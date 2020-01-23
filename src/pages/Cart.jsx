import React from 'react';
import swal from 'sweetalert2';
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
    }

    componentWillUnmount = async () =>{
        this.props.handleReset()
    }

    componentDidUpdate = async()=>{
        await this.props.handleError()
    }

    handleCheckOut = async () =>{
        const cart = await JSON.parse(localStorage.getItem('cart'))
        if(!Array.isArray(cart)||cart.length<1){
            await swal.fire({
                title: 'Error!',
                text: 'Please put item into cart first',
                icon: 'warning',
                confirmButtonText: 'okay',
                confirmButtonColor: '#b36232',
              });
            this.props.history.push('/')
        } else if(this.props.isAdmin){
            await swal.fire({
                title: 'Error!',
                text: 'You are an admin, you cannot do checkout',
                icon: 'error',
                confirmButtonText: 'understood',
                confirmButtonColor: '#b36232',
              });
        }else if(!this.props.isLogin){
            await swal.fire({
                title: 'Error!',
                text: 'You have not logged in yet, please log in first!',
                icon: 'error',
                confirmButtonText: 'Login now',
                cancelButtonText: 'Later',
                confirmButtonColor: '#b36232',
                cancelButtonColor: '#c6381f',
                showCancelButton: true
              }).then(result => {
                  if(result.value){
                      this.props.history.push('/login')
                  } else{
                      swal.fire({
                          title: 'Directing....',
                          timer: 2000,
                          onBeforeOpen: () => {swal.showLoading()},
                          onClose: () => {this.props.history.push('/')}
                      })
                  }
            })
        } else {
            this.props.history.push('/checkout')
        }
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
                        id={item.data.id}
                        name={item.data.name}
                        image={item.data.image}
                        price={item.data.price}
                        qty={item.qty}
                        updateCart={this.props.updateCart}
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
                        <div className="col-xl-2"></div>
                        <div className="col-xl-8">
                            <div className="container mb-5">
                                {dataToShow}
                            </div>
                            <div className="row col-12 justify-content-center">
                                <div className="cart-button">
                                    <Link className="btn btn-danger btn-clear" onClick={()=>localStorage.removeItem('cart')}>Clear Cart</Link>
                                    <Link className="btn btn-danger btn-checkout" onClick={this.handleCheckOut}>Check Out</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2"></div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect('categoryList, isLogin, isAdmin', actions)(withRouter(Cart))