import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer';

import banner from '../images/banner1.png';

class Cart extends React.Component{
    componentDidMount = async () => {
        await this.props.checkLoginStatus();
        await this.props.getCategory();
        console.log(JSON.parse(localStorage.getItem('cart')))
    }
    render(){
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>Cart</h1>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-3 cart-box">
                                        <div className="img-box">
                                            <img src={banner} alt="cart-product"/>
                                        </div>
                                    <div className="col-md-6"></div>
                                    <div className="col-md-3"></div>
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