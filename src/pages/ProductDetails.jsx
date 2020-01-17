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
        this.props.getCategory();
        const index = this.props.match.params.index
        const input = {
            method: "get",
            url: "http://0.0.0.0:5000/product/"+index,
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

    render(){
        console.log(this.props)
        const data = this.props.data
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>{data.name}</h1>
                    </div>
                    <hr/>
                    <div className="row product-details-box">
                        <div className="col-lg-6">
                            <img src={data.image} alt=""/>
                        </div>
                        <div className="col-lg-6">
                            <div className="product-details-description">
                                <h5>{data.description}</h5>
                            </div>
                            <h2>Rp{data.price}.00</h2>
                            <div className="product-details-cart">
                                <div className="product-details-stock">
                                    <span>Quantity: </span>
                                    <input type="number" name="qty" min="1" value={this.state.qty} max={data.stock} onChange={e=>this.handleInput(e)}/>
                                    <span>stock: {data.stock}</span>
                                </div>
                                <div className="product-details-button">
                                    <Link className="btn btn-danger btn-cart" onClick={()=>this.addToCart(data)}>to Cart</Link>
                                    <Link className="btn btn-danger btn-buy">Buy</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row col-md-12 gap-100"></div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect('data',actions)(withRouter(ProductDetails))