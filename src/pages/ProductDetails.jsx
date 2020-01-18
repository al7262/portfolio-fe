import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

class ProductDetails extends React.Component{
    state = {
        isLoading: true,
        qty: 1,
        category: ''
    }

    componentDidMount = async () => {
        await this.props.checkLoginStatus()
        await this.props.getCategory();
        const index = this.props.match.params.index
        const input = {
            method: "get",
            url: await this.props.baseUrl+"product/"+index,
            headers: {
                "Content-Type": "application/json"
            }
        }
        await this.props.handleApi(input)
        const data = await this.props.data
        if(data!==undefined){
            this.setState({isLoading: false})
            await this.setState({category:this.getCategoryName(data.category_id)})
        }
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
        await this.setState({category:''})
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    getCategoryName = (category_id) => {
        let category;
        const categoryList = this.props.categoryList
        if(Array.isArray(categoryList)){
            for(const item in categoryList){
                if(categoryList[item].id===category_id){
                    category=categoryList[item].name
                }
            }
        }
        return category
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
                    <div className="row product-details-box">
                        <div className="col-lg-6 mb-5">
                            <img src={data.image} alt=""/>
                        </div>
                        <div className="col-lg-6">
                            <h6 className="mb-2 font-weight-bold">Category: {this.state.category}</h6>
                            <div className="product-details-description">
                                <p>{data.description}</p>
                            </div>
                            <h2>Rp{data.price}.00</h2>
                            <div className="product-details-cart">
                                <div className="product-details-stock">
                                    <span>Quantity: </span>
                                    <input type="number" name="qty" min="1" value={this.state.qty} max={data.stock} onChange={e=>this.handleInput(e)}/>
                                    <span>stock: {data.stock}</span>
                                </div>
                                <div className="product-details-button">
                                    <Link className="btn btn-danger btn-cart" onClick={()=>this.props.addToCart(data, this.state.qty)}>to Cart</Link>
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

export default connect('data, categoryList, baseUrl',actions)(withRouter(ProductDetails))