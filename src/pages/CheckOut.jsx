import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer';

class CheckOut extends React.Component{
    state = {
        order: '',
    }

    componentDidMount = async () => {
        await this.props.checkLoginStatus();
        await this.props.getCategory();
    }

    postOrder = async() =>{
        const claims=this.props.claims
        const input = {
            method: "post",
            url: await this.props.baseUrl+"Order",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                username: this.state.username.toLowerCase(),
                password: this.state.password,
                email: this.state.email
            },
            validateStatus: (status) => {
                return status<500
            }
        };
    }

    render(){
        
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>Shopping CheckOut</h1>
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
                                    <Link className="btn btn-danger btn-clear" onClick={()=>localStorage.removeItem('cart')}>Clear CheckOut</Link>
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

export default connect('categoryList', actions)(withRouter(CheckOut))