import React from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';

import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

class NotMatchPage extends React.Component{
    componentDidMount = async () =>{
        await this.props.checkLoginStatus();
        await this.props.getCategory();
    }

    render(){
        return (
            <React.Fragment>
                <Header {...this.props}/>
                <div className="container">
                    <div class="d-flex justify-content-center align-items-center" id="main">
                        <h1 class="mr-3 pr-3 align-top border-right inline-block align-content-center">404</h1>
                        <div class="inline-block align-middle">
                            <h2 class="font-weight-normal lead" id="desc">The page you requested was not found.</h2>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}


export default connect('', actions)(withRouter(NotMatchPage));