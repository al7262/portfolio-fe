import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import banner1 from '../images/banner1.png'
import banner2 from '../images/banner2.png'
import banner3 from '../images/banner3.png'
import sidebar1 from '../images/sidebar1.png'
import sidebar2 from '../images/sidebar2.png'
import sidebar3 from '../images/sidebar3.png'

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import NewestProductList from '../components/NewestProductList'; 

class Home extends React.Component {
    state = {
        isLoading: true
    }
    
    componentDidMount = async () =>{
        await this.props.checkLoginStatus();
        await this.props.getCategory();
        await this.getNewestProduct();
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        this.props.handleReset()
    }

    componentDidUpdate = async()=>{
        await this.props.handleError()
    }

    getNewestProduct = async () =>{
        const input = {
            method: "get",
            url: await this.props.baseUrl+"product/list",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                orderby: 'created_at',
                sort: 'desc',
                rp: 4
            }
        };
        await this.props.handleApi(input)
        this.setState({isLoading:false})
    }

    render(){
        let productToShow;
        let data = this.props.data
        if(data!==undefined){
            data = data.result
        }
        if(Array.isArray(data)){
            productToShow = data.map((item,key)=>{
                return (
                    <NewestProductList
                        key={key}
                        title={item.name}
                        image={item.image}
                        id={item.id}
                        />
                )
            })
        }
        return (
            <React.Fragment>
                <Header
                    isHome={true}/>
                <div className="container mt-lg-5 mt-0">
                    <div className="row">
                        <div className="col-lg-8 mb-lg-0 mb-3 pr-0 pl-0">
                            <div id="main-carousel" className="carousel slide carousel-fade" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    <li data-target="#main-carousel" data-slide-to="0" className="active"></li>
                                    <li data-target="#main-carousel" data-slide-to="1"></li>
                                    <li data-target="#main-carousel" data-slide-to="2"></li>
                                </ol>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img className="w-100" src={banner1} alt="First slide"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img className="w-100" src={banner2} alt="Second slide"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img className="w-100" src={banner3} alt="Third slide"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 side-promo">
                            <div className="row h-100">
                                <div className="col-lg-12 col-4 mb-lg-3 pr-0 pl-lg-3 pl-0">
                                    <div className="side-promo-inside">
                                        <img src={sidebar1} alt=""/>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-4 mb-lg-3 pr-0">
                                    <div className="side-promo-inside">
                                        <img src={sidebar2} alt=""/>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-4 pr-0">
                                    <div className="side-promo-inside">
                                        <img src={sidebar3} alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr/>
                    <div className="row">
                        <div className="col-12 newest-product-title">
                            <h1>Newest Product</h1>
                            </div>
                        <div className="col-12 newest-product-box">
                            <div className="row">
                                {this.state.isLoading?
                                <div className="loading-box"><i className="material-icons">cached</i></div>
                                :
                                productToShow
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>

        )
    }
}
export default connect('data, baseUrl', actions)(withRouter(Home));
