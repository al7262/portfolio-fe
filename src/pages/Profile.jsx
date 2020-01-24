import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProfileDetail from '../components/ProfileDetail'; 
import AddressDetail from '../components/AddressDetail';

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
        this.props.handleReset()
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
            url: await this.props.baseUrl+"user"+url,
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input);
        const data = this.props.data
        if(data.hasOwnProperty('image')){
            console.log(data.image)
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
            url: await this.props.baseUrl+"user/address/"+value,
        }
        await this.props.handleApi(input);
        if(this.props.data.hasOwnProperty('message')){
            swal.fire({
                title: 'Done!',
                text: 'You have successfully delete address',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false
              })
        }
        this.handlePosition(this.state.position);
    }

    render() {
        let dataToShow;
        const position = this.props.match.params.option;
        let data = this.props.data;
        if(position==='dashboard'){
            console.log(data)
            if(data===undefined||data===''){
                dataToShow = <div className="no-details"><h3>There is no details....<Link to="/user/detail/add">Click here to add</Link></h3></div>
            } else{
                dataToShow = <ProfileDetail
                    key={data.id}
                    fname={data.fname}
                    lname={data.lname}
                    gender={data.gender}
                    email={data.email}
                    username={data.username}
                    birthDate={data.birth_date}/>
            }
        } else if(position==='address'){
            if(data===undefined||data===''){
                dataToShow = <div className="no-details"><h3>There is no address....<Link to="/user/address/add">Click here to add</Link></h3></div>
            } else{
                data = data.result
                if(Array.isArray(data)){
                    dataToShow = data.map((item, key)=>{
                        return(
                            <AddressDetail
                                key={key}
                                index={key}
                                id={item.id}
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
            data = data.result
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
                            <div className="list-group list-group-flush order-md-2 order-1 mb-5">
                                <Link to="#" className={"list-group-item list-group-item-action "+
                                (this.state.position==='dashboard'? 'active':'')} onClick={()=>this.handlePosition('dashboard')}>
                                    Dashboard</Link>
                                <Link to="#" className={"list-group-item list-group-item-action "+
                                (this.state.position==='address'? 'active':'')} onClick={()=>this.handlePosition('address')}>
                                    Address</Link>
                                <Link to="#" className={"list-group-item list-group-item-action "+
                                (this.state.position==='order'? 'active':'')} onClick={()=>this.handlePosition('order')}>
                                    Order</Link>
                            </div>
                        </div>
                        <div className="col-md-9 manage-side">
                            {this.state.isLoading?
                            <div className="loading-box"><i className="material-icons">cached</i></div>
                            :dataToShow}
                        </div>
                    </div>
                    <div className="row col-md-12 gap-50">
                        {this.state.position==='address'?
                        <div className="manage-add-btn">
                            <Link className="btn-add" to={"/user/"+this.state.position+"/add"}>
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

export default connect('data, baseUrl',actions)(withRouter(Profile));