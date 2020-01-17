import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import logo from '../images/logo-light.svg'

class Header extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm">
                <Link className="navbar-brand" to="/">
                    <img src={logo} style={{height: "35px"}} alt=""/>
                    <span className="ml-1">Ancient.shop</span>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <form className="form-inline ml-auto mr-auto my-2 my-lg-0">
                        <input className="form-control w-80" type="search" 
                        placeholder="Search" name="search" value={this.props.search}
                        onChange={e=>this.props.handleInput(e)}/>
                        <Link className="btn btn-outline-custom pb-0 h-100 w-20" type="submit" to="/item/search">
                            <i className="material-icons">search</i>
                        </Link>
                    </form>

                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className={this.props.isHome? "nav-item active" : "nav-item"}>
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className={"nav-item dropdown"+(this.props.isCategory? "active" : "")}>
                            <Link className="nav-link dropdown-toggle"
                            id="categoryDropdown" data-toggle="dropdown" 
                            aria-haspopup="true" aria-expanded="false">
                                Category
                            </Link>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="categoryDropdown">
                                {Array.isArray(this.props.categoryList)?
                                this.props.categoryList.map((item)=>(
                                    <Link class="dropdown-item" to={"/item/category/"+item.name.replace(' ','+').toLowerCase()}>{item.name}</Link>
                                    ))
                                :
                                null
                                }
                            </div>
                        </li>
                        <li className={this.props.isContact? "nav-item active" : "nav-item"}>
                            <Link className="nav-link" to="#">Contact Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#">
                                <span className="d-lg-none">Shopping Cart</span>
                                <i className="material-icons">shopping_cart</i>
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link"
                            id="accountDropdown" data-toggle="dropdown" 
                            aria-haspopup="true" aria-expanded="false">
                                <span className="d-lg-none">Account</span>
                                <i className="material-icons">account_circle</i>
                            </Link>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="accountDropdown">
                                {this.props.isLogin?
                                <React.Fragment>
                                    {this.props.isAdmin?
                                    <Link class="dropdown-item" to="/manage">Manage</Link>
                                        :
                                    <Link class="dropdown-item" to="/user">Profile</Link>
                                    }
                                    <Link class="dropdown-item" to="/" onClick={()=>this.props.handleLogout()}>Logout</Link>
                                </React.Fragment>
                                    :
                                <React.Fragment>
                                    <Link class="dropdown-item" to="/login">Login</Link>
                                    <Link class="dropdown-item" to="/register">Register</Link>
                                </React.Fragment>
                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default connect("isLogin, isAdmin, search, categoryList",actions)(withRouter(Header))