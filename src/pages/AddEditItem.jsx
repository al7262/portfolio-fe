import React from 'react';
import swal from 'sweetalert2';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProductForm from '../components/ProductForm';
import CategoryForm from '../components/CategoryForm';
import DetailForm from '../components/DetailForm';
import AddressForm from '../components/AddressForm';

class AdminAddEdit extends React.Component{
    state = {
        name: '',
        description: '',
        image: '',
        category: '',
        stock: '',
        price: '',
        fname: '',
        lname: '',
        gender: '',
        birthDate: '',
        contact: '',
        details: '',
        city: '',
        selectedCity: '',
        province: '',
        selectedProvince: '',
        zipcode: '',
        editData:undefined
    }

    componentWillUnmount = async () =>{
        this.props.handleReset()
    }
    
    componentDidUpdate = async() => {
        await this.props.handleError()
    }

    componentDidMount = async () =>{
        await this.props.checkLoginStatus();
        const position = this.props.match.params.option
        const action = this.props.match.params.action
        if (position==='product'){
            await this.props.getCategory()
        }
        if (position==='address'){
            await this.props.getProvince()
            console.log(this.props.provinceList)
        }
        if (action==='edit'){
            await this.getItem(position)
            this.setState({editData: await this.props.data})
            const data = this.state.editData
            if(data!==undefined){
                this.setState({name:data.name})
                this.setState({description:data.description})
                this.setState({image:data.image})
                this.setState({category:data.category})
                this.setState({stock:data.stock})
                this.setState({price:data.price})
                this.setState({editdata: undefined})
                this.setState({fname: data.fname})
                this.setState({lname: data.lname})
                this.setState({image: data.image})
                this.setState({birthDate: data.birthDate})
                this.setState({gender: data.gender})
                this.setState({contact: data.contact})
                this.setState({details: data.details})
                this.setState({city: data.city})
                this.setState({province: data.province})
                this.setState({zipcode: data.zipcode})
            }
        }
    }

    getItem = async (value) => {
        const index = this.props.match.params.index
        console.log(this.props)
        value = value==='detail'||value==='address'? value==='detail'? "user/"+value :"user/"+value+"/"+index : value+"/"+index
        const input = {
            method: 'get',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+value,
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input);
    }

    validateForm = async () => {
        const position = this.props.match.params.option
        const action = this.props.match.params.action
        const warning = document.getElementById('warning')
        const regPhone = new RegExp(/^[+]\d{9-16}/)
        const regZipCode = new RegExp(/^\d{6}/)
        let data;
        if(position==='category'){
            if(this.state.name===''){
                warning.innerHTML='Please fill in the name'
            } else{
                data = {
                    name: this.state.name,
                    description: this.state.description
                }
                console.log(data)
            }
        } else if(position==='product'){
            if(this.state.name===''){
                warning.innerHTML='Please fill in the name'
            } else if(this.state.price===''){
                warning.innerHTML='Please fill in the price'
            } else if(this.state.stock===''){
                warning.innerHTML='Please fill in the stock'
            } else {
                data = {
                    name: this.state.name,
                    description: this.state.description,
                    category_id: this.state.category,
                    price: this.state.price,
                    image: this.state.image,
                    stock: this.state.stock
                }
                console.log(data)
            }
        } else if(position==='detail'){
            if(this.state.fname===''){
                warning.innerHTML='Please fill in your first name'
            } else if(this.state.gender===''){
                warning.innerHTML='Please fill in your gender'
            } else if(this.state.birthDate===''){
                warning.innerHTML='Please fill in your birth date'
            }
            data = {
                fname: this.state.fname,
                lname: this.state.lname,
                gender: this.state.gender,
                image: this.state.image,
                birth_date: this.state.birthDate,
            }
        } else if(position==='address'){
            if(this.state.contact===''){
                warning.innerHTML='Please fill in your contact number'
            } else if(this.state.details===''){
                warning.innerHTML='Please fill in your address details'
            } else if(this.state.city===''){
                warning.innerHTML='Please fill in your address city'
            } else if(this.state.province===''){
                warning.innerHTML='Please fill in your address province'
            } else if(this.state.zipcode===''){
                warning.innerHTML='Please fill in your address zipcode'
            } else if(this.state.contact.match(regPhone)){
                warning.innerHTML='Input your contact like this: +62XXXXXXXXXX'
            } else if(this.state.zipcode.match(regZipCode)){
                warning.innerHTML='Please fill correct Zip Code'
            } else {
                data = {
                    contact: this.state.contact,
                    details: this.state.details,
                    city: this.state.city,
                    province: this.state.province,
                    zipcode: this.state.zipcode,
                }
            }
        }
        if(data!==undefined){
            if(action==='add'){
                console.log(data)
                await this.postItem(data)
                await this.props.handleError()
            } else if(action==='edit'){
                await this.updateItem(data)
                await this.props.handleError()
            }
        }
    }

    postItem = async (data) =>{
        const position = this.props.match.params.option
        const url = position==='detail'||position==='address'? "user/"+position : position
        const input = {
            method: 'Post',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+url,
            data: data,
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input);
        if(await this.props.data.hasOwnProperty('id')){
            swal.fire({
                title: 'Done!',
                text: 'You have successfully input the item',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false
              })
            if(position==='category'||position==='product'){
                this.props.history.push('/manage')
            } else {
                this.props.history.push('/user')
            }
        }
    }

    updateItem = async (data) =>{
        const position = this.props.match.params.option
        const index = this.props.match.params.index
        console.log(position)
        const url = position==='detail'||position==='address'? "user/"+position : position+"/"+index

        const input = {
            method: 'put',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+url,
            data: data,
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input);
        if(await this.props.data.hasOwnProperty('id')){
            swal.fire({
                title: 'Done!',
                text: 'You have successfully update the item',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false
              })
            if(position==='category'||position==='product'){
                this.props.history.push('/manage')
            } else{
                this.props.history.push('/user')
            }
        }
    }

    handleInput = async (event) => {
        const name=event.target.name, value=event.target.value;
        this.setState({ [name] : value})
        if(name==='province'){
            await this.getSelectedProvince(value)
            const provinceId=await this.state.selectedProvince.province_id
            await this.props.getCity(provinceId)
        }
        if(name==='city'){
            await this.getSelectedCity(value)
            const zipcode = await this.state.selectedCity.postal_code
            await this.setState({zipcode: zipcode})
        }
    }

    getSelectedProvince = async(name) => {
        const provinces = await this.props.provinceList
        let selected; 
        await provinces.forEach(item=>{
            if(item.province===name){
                selected=item
            }
        })
        await this.setState({selectedProvince:selected})
    }

    getSelectedCity = async(name) => {
        const cities = await this.props.cityList
        let selected; 
        await cities.forEach(item=>{
            if(item.city_name===name){
                selected=item
            }
        })
        await this.setState({selectedCity:selected})
    }

    render(){
        const position = this.props.match.params.option
        const action = this.props.match.params.action
        let formToShow;
        if(position==='category'){
            formToShow=<CategoryForm 
                name={this.state.name}
                description={this.state.description}
                handleInput={this.handleInput}/>
        } else if(position==='product') {
            formToShow=<ProductForm 
                name={this.state.name}
                description={this.state.description}
                image={this.state.image}
                stock={this.state.stock}
                price={this.state.price}
                handleInput={this.handleInput}
                categoryList={this.props.categoryList}/>
        } else if(position==='detail') {
            formToShow= <DetailForm
                fname={this.state.fname}
                lname={this.state.lname}
                gender={this.state.gender}
                image={this.state.image}
                birthDate={this.state.birthDate}
                handleInput={this.handleInput}/>
        } else if(position==='address'){
            formToShow=<AddressForm
                contact={this.state.contact} 
                details={this.state.details} 
                city={this.state.city} 
                province={this.state.province} 
                zipcode={this.state.zipcode} 
                provinceList={this.props.provinceList}
                cityList={this.props.cityList}
                handleInput={this.handleInput}/>
        }
        
        return(
            <React.Fragment>
                <Header/>
                <div className="manage-form-container">
                    <h1 className="text-capitalize">{action} {position}</h1>
                    <span id="warning"></span>
                    <div className="manage-form-box">
                        <form action="" method="" onSubmit={e => e.preventDefault()}>
                            {formToShow}
                            <Link className="btn btn-danger btn-block submit" type="submit" onClick={this.validateForm}>Submit</Link>
                            <div className="other-button">
                                <button className="btn btn-danger btn-block btn-other" type="reset">Reset</button>
                                <Link className="btn btn-danger btn-block btn-other" to={position==='category'||position==='product'? '/manage':'/user'}>Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>   
                <Footer/>
            </React.Fragment>
        )
    }
}

export default connect('data, categoryList, baseUrl, provinceList, cityList', actions)(withRouter(AdminAddEdit));
