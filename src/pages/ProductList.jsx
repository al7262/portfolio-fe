import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

class ProductDetails extends React.Component{
    state = {
        isLoading: true,
        qty: 1
    }

    componentDidMount = async () => {
        this.props.checkLoginStatus()
        this.props.getCategory()
        const index = this.props.match.params.index
        const input = {
            method: "get",
            url: "http://0.0.0.0:5000/product/list",
            headers: {
                "Content-Type": "application/json"
            }
        }
        await this.props.handleApi(input)
        const data = this.props.data
        if(data!==undefined){
            this.setState({isLoading: false})
        }
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    addToCart = async (data) => {
        if(await this.state.qty>data.stock){
            await this.setState({qty:data.stock})
        }
        const dict = {
            product_id: data.id,
            qty: await parseInt(this.state.qty)
        }
        const cart = localStorage.getItem('cart')===null? [] : JSON.parse(localStorage.getItem('cart'))
        console.log(cart)
        cart.push(dict);
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    render(){
        const data = this.props.data
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>{data.name}</h1>
                    </div>
                    <hr/>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect('data',actions)(withRouter(ProductDetails))