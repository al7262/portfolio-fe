import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import logo from '../images/logo-light.svg'

class Login extends React.Component {
    state={
        username: '',
        password: ''
    }
    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
    }
    
    // to handle click on login button
    handleLogin = async () => {
        const input = {
            method: "get",
            url: await this.props.baseUrl+"login",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                username: await this.state.username.toLowerCase(),
                password: await this.state.password
            },
            validateStatus: (status) => {
                return status<500
            }
        };
        try {
            await this.props.handleApi(input)
        } catch (error) {
            console.log('just some error', error)            
        }
        const data = await this.props.data
        if(data.hasOwnProperty('token')){
            localStorage.setItem('token', this.props.data.token)
            await this.props.handleChange('isLogin', true)
            this.props.history.push('/')
            swal.fire({
                title: 'Welcome!',
                text: 'You have successfully logged in!',
                icon: 'success',
                confirmButtonText: 'okay'
              })
        }
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    render(){
        return (
            <div className="login-container">
                <Link className="link-to-home" to='/'>
                    <i className="material-icons">home</i>
                    <span>Return to home</span>
                </Link>
                <div className="avatar">
                    <img style={{width:'90%'}} src={logo} alt=""/>
                    <h4>Ancient.shop</h4>
                </div>
                <div className="form-box">
                    <form action="" method="" onSubmit={e => e.preventDefault()}>
                        <input name="username" type="text" placeholder="Username" onChange={e => this.handleInput(e)} />
                        <input name="password" type="password" placeholder="Password"  onChange={e => this.handleInput(e)} />
                        <button className="btn btn-danger btn-block login" type="submit" onClick={() => this.handleLogin()}>Login</button>
                    </form>
                </div>
                <span>
                    Have not registered? <Link to="/register">click Here</Link>
                </span>
            </div>   
        )
    }
}

export default connect("username, password, data, baseUrl", actions)(withRouter(Login))