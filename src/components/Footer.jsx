import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";
import logo from '../images/logo-light.svg'

class Footer extends React.Component{
    render(){
        return(
            <React.Fragment>
                <footer>
                    <div className="container mt-5 pt-5 pb-4">
                        <div className="row">
                            <div className="col-md-6">
                                <h3>About Us</h3>
                                <p>This is just a weird shop that sells many unique 
                                    things that you cannot think of before. Many 
                                    of the things here is bought by the owner from overseas out 
                                    of nowhere to be sold again here.
                                </p>
                            </div>
                            <div className="col-md-3">
                                <h3>Category</h3>
                                <ul className="list-unstyled">
                                {this.props.categoryList===undefined?
                                null
                                :
                                this.props.categoryList.map((item,key)=>(
                                    <li key={key}>
                                        <Link to={"/item/category/"+item.name.replace(' ','+')}>{item.name}</Link>
                                    </li>
                                ))
                                }
                                </ul>
                            </div>
                            <div className="col-md-3">
                                <h3>Our Page</h3>
                                <ul className="list-unstyled">
                                    <li>
                                        <Link to="">Contact Us</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-md-12 d-flex justify-content-center">
                                <img src={logo} alt="" style={{height: '20px', marginRight: '10px'}}/>
                                <span>Ancient.shop   est. 2019</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </React.Fragment>
        )
    }
}

export default connect('categoryList',actions)(withRouter(Footer))