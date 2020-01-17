import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProfileDetail from '../components/ProfileDetail'; 

class Profile extends React.Component{
    state = {
        position: 'dashboard',
        isLoading: false,
        profilePic: 'https://thumbs.dreamstime.com/b/default-placeholder-profile-icon-avatar-gray-woman-90197997.jpg',
    }

    componentDidMount = async () =>{
        await this.props.checkLoginStatus();
        await this.props.getCategory();
        await this.handlePosition(this.state.position);
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
    }

    handlePosition = async (value) => {
        await this.setState({isLoading: true})
        await this.props.handleChange('data', '')
        this.props.history.replace('/user/'+value)
        const url = value==='dashboard'? '/detail' : value==='account'? '' : value==='address'? '/address/list' : '/'+value
        const input = {
            method: 'get',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: "http://0.0.0.0:5000/user"+url,
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input);
        const data = this.props.data
        if(data.hasOwnProperty('image')){
            if(data.image!==undefined||data.image!==''){
                this.setState({profilePic:data.image})
            }
        }
        await this.setState({position: value})
        await this.setState({isLoading: false})
    }

    handleDeleteItem = async(value) => {
        const input = {
            method: 'delete',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: "http://0.0.0.0:5000/user/address/"+value,
        }
        await this.props.handleApi(input);
        if(this.props.data.hasOwnProperty('message')){
            swal.fire({
                title: 'Done!',
                text: 'You have successfully delete address',
                icon: 'success',
                confirmButtonText: 'okay'
              })
        }
        this.handlePosition(this.state.position);
    }

    render() {
        let dataToShow;
        const position = this.props.match.params.option;
        const data = this.props.data;
        if(position==='dashboard'){
            if(data===undefined){
                dataToShow = <div className="no-details"><h3>There is no details....<Link to="/user/detail/add">Click here to add</Link></h3></div>
            } else{
                dataToShow = <ProfileDetail
                    fname={data.fname}
                    lname={data.lname}
                    gender={data.gender}
                    email={data.email}
                    username={data.username}
                    birthDate={data.birthDate}/>
            }
        } else if(position==='address'){
            if(data===undefined||data===''){
                console.log(data)
                dataToShow = <div className="no-details"><h3>There is no address....<Link to="/user/address/add">Click here to add</Link></h3></div>
            } else{
                if(Array.isArray(data)){
                    dataToShow = data.map((item, key)=>{
                        return(
                            <ProfileDetail
                                key={key}
                                index={key}
                                contact={item.contact}
                                details={item.details}
                                city={item.city}
                                province={item.province}
                                country={item.country}
                                zipcode={item.zipcode}
                                handleDeleteItem={this.handleDeleteItem}/>
                        )
                    })
                }
            }
        } else if(position==='order'){
            
        }
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>Profile Page</h1>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-3 side-bar mb-5 d-flex flex-column">
                            <div className="profile-pic order-md-1 order-2">
                                <img src={this.state.profilePic} alt="user-profile"/>
                            </div>
                            <div class="list-group list-group-flush order-md-2 order-1 mb-5">
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='dashboard'? 'active':'')} onClick={()=>this.handlePosition('dashboard')}>
                                    Dashboard</Link>
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='address'? 'active':'')} onClick={()=>this.handlePosition('address')}>
                                    Address</Link>
                                <Link to="#" class={"list-group-item list-group-item-action "+
                                (this.state.position==='order'? 'active':'')} onClick={()=>this.handlePosition('order')}>
                                    Order</Link>
                            </div>
                        </div>
                        <div className="col-md-9 manage-side">
                            {dataToShow}
                        </div>
                    </div>
                    <div className="row col-md-12 gap-50"></div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect('data',actions)(withRouter(Profile));