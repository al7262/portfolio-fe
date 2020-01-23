import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

class Registration extends React.Component{
    state = {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        confirmEmail: ''
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        this.props.handleReset()
    }

    componentDidUpdate = async()=>{
        await this.props.handleError()
    }

    handleRegistration = async () => {
        const input = {
            method: "post",
            url: await this.props.baseUrl+"user",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                username: this.state.username.toLowerCase(),
                password: this.state.password,
                email: this.state.email
            },
            validateStatus: (status) => {
                return status<500
            }
        };
        await this.props.handleApi(input)
        const data = await this.props.data
        if(data.hasOwnProperty('id')){
            this.props.history.push('/')
            swal.fire({
                title: 'Done!',
                text: 'You have successfully registered!',
                icon: 'success',
                confirmButtonText: 'okay'
              })
        }
        this.props.handleError()
    }

    validateForm = async () => {
        const warning = document.getElementById('warning')
        const passLength = new RegExp(/(?=.{6,})/);
        const passUpper = new RegExp(/(?=.*[A-Z])/);
        const passNumber = new RegExp(/(?=.*[1-9])/);
        const emailRegex = new RegExp(/^(\w+[.-_]?\w+)@(\w+[.-_]?\w+).(\w{2,3})$/);
        if(this.state.username===''){
            warning.innerHTML='username must be filled!';
        } else if(this.state.password===''){
            warning.innerHTML='password must be filled!';
        } else if(this.state.confirmPassword===''){
            warning.innerHTML='confirm password must be filled!';
        } else if(this.state.email===''){
            warning.innerHTML='email must be filled!';
        } else if(this.state.confirmEmail===''){
            warning.innerHTML='confirm email must be filled!';
        } else if (!this.state.password.match(passLength)){
            warning.innerHTML='password must be more than 6 character';
        } else if (!this.state.password.match(passUpper)){
            warning.innerHTML='password must contain uppercase';
        } else if (!this.state.password.match(passNumber)){
            warning.innerHTML='password must contain number';
        } else if(!this.state.email.match(emailRegex)){
            warning.innerHTML='email is not inputted correctly';
        } else if(this.state.password!==this.state.confirmPassword){
            warning.innerHTML='password and confirm password are different';
        } else if(this.state.email!==this.state.confirmEmail){
            warning.innerHTML='email and confirm email are different';
        } else {
            await this.handleRegistration()
            
        }
    }

    render(){
        return(
            <React.Fragment>
                <div className="login-container">
                    <Link className="link-to-home" to='/'>
                        <i className="material-icons">home</i>
                        <span>Return to home</span>
                    </Link>
                    <h1>Register</h1>
                    <span id="warning"></span>
                    <div className="form-box">
                        <form action="" method="" onsubmit={e => e.preventDefault()}>
                            <input type="text" name="username" id=""  
                            placeholder="Username" value={this.state.username}
                            onChange={e=>this.handleInput(e)}/>
                            <input type="password" name="password" id=""  
                            placeholder="Password" value={this.state.password}
                            onChange={e=>this.handleInput(e)}/>
                            <input type="password" name="confirmPassword" id="" 
                            placeholder="Confirm Password" value={this.state.confirmPassword}
                            onChange={e=>this.handleInput(e)}/>
                            <input type="text" name="email" id=""  
                            placeholder="Email" value={this.state.email}
                            onChange={e=>this.handleInput(e)}/>
                            <input type="text" name="confirmEmail" id="" 
                            placeholder="Confirm Email" value={this.state.confirmEmail}
                            onChange={e=>this.handleInput(e)}/>
                            <Link className="btn btn-danger btn-block login" onClick={()=>this.validateForm()}>Register</Link>
                            <span>
                                Already owns account? <Link to="/login">click Here</Link>
                            </span>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default connect("data, baseUrl", actions)(withRouter(Registration))