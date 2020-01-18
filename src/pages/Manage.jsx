import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ManageList from '../components/ManageList';

class Manage extends React.Component{
    state = {
        position: 'dashboard',
        isLoading: false
    }

    componentDidMount = async () =>{
        await this.props.checkLoginStatus();
        await this.props.getCategory();
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
    }

    handlePosition = async (value) => {
        await this.setState({isLoading: true})
        await this.props.handleChange('data', '')
        this.props.history.replace('/manage/'+value)
        const input = {
            method: 'get',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+value+"/list",
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input);
        await this.setState({position: value})
        await this.setState({isLoading: false})
    }

    handleDeleteItem = async(value) => {
        const position = this.props.match.params.option
        const input = {
            method: 'delete',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+position+"/"+value
        }
        await this.props.handleApi(input);
        if(this.props.data.hasOwnProperty('message')){
            swal.fire({
                title: 'Done!',
                text: 'You have successfully delete the item',
                icon: 'success',
                confirmButtonText: 'okay'
              })
        }
        this.handlePosition(this.state.position);
    }

    render(){
        let dataToShow;
        const data = this.props.data;
        if(Array.isArray(data)){
            dataToShow = data.map((item)=>{
                return(
                    <ManageList 
                    name={item.name}
                    id={item.id}
                    position={this.state.position}
                    handleDeleteItem={this.handleDeleteItem}
                    />
                )
            })
        }
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>Admin Page</h1>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-3 side-bar vl-manage mb-2">
                            <div class="list-group list-group-flush">
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='dashboard'? 'active':'')} onClick={()=>this.handlePosition('dashboard')}>
                                    Dashboard</Link>
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='product'? 'active':'')} onClick={()=>this.handlePosition('product')}>
                                    Product</Link>
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='category'? 'active':'')} onClick={()=>this.handlePosition('category')}>
                                    Category</Link>
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='order'? 'active':'')} onClick={()=>this.handlePosition('order')}>
                                    Order</Link>
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='user'? 'active':'')} onClick={()=>this.handlePosition('user')}>
                                    Users</Link>
                            </div>
                        </div>
                        <div className="col-md-9 manage-side">
                            {this.state.position==='dashboard'?
                            <div className='dashboard'>
                                <h3>WELCOME TO ADMIN PAGE</h3>
                                <p></p>
                            </div >
                            :
                            this.state.isLoading?
                                <div className="loading-box"><i className="material-icons">cached</i></div>
                                :
                                <table className="manage-table">
                                    <thead>
                                        <td style={{width:'10%'}}>ID</td>
                                        <td>Name of {this.state.position}</td>
                                        <td style={{width:'20%'}}>Action</td>
                                    </thead>
                                    {dataToShow}
                                </table>
                            }
                        </div>
                    </div>
                    <div className="row col-md-12 gap-50">
                        {this.state.position==='category'||this.state.position==='product'?
                        <div className="manage-add-btn">
                            <Link className="btn-add" to={"/manage/"+this.state.position+"/add"}>
                                <i className="material-icons">add_circle</i>
                            </Link>
                        </div>
                        :
                        null
                        }

                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect('isLogin, isAdmin, data, baseUrl', actions)(withRouter(Manage));
