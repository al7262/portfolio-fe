import React from 'react';
import swal from 'sweetalert2'
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer';
import CheckoutProductList from '../components/CheckoutProductList';
import AddressForm from '../components/AddressForm';

class CheckOut extends React.Component{
    state = {
        order: undefined,
        listAddress: undefined,
        contact: '',
        details: '',
        city: '',
        selectedCity: '',
        province: '',
        selectedProvince: '',
        zipcode: '',
        address: '',
        newAddress: '',
        payment: '',
        courier: '',
        shipmentCost: 0,
    }

    componentDidMount = async () => {
        await this.props.checkLoginStatus();
        await this.props.getCategory();
        await this.getAddress();
    }

    componentWillUnmount = async () =>{
        this.props.handleReset()
    }

    componentDidUpdate = async()=>{
        await this.props.handleError()
    }

    handleInput = async (event) => {
        const name = event.target.name, value = event.target.value
        this.setState({ [name] : value })
        if(name==='address'){
            await this.props.getProvince();
            if(value==='new'){
                this.setState({
                    contact: '',
                    details: '',
                    city: '',
                    province: '',
                    country: '',
                    zipcode: '',
                })
            } else {
                await this.setAddress(value)
                await this.setShipmentCost(this.state.courier)
            }
        }
        if(name==='province'){
            await this.getSelectedProvince(value)
            const provinceId=await this.state.selectedProvince.province_id
            await this.props.getCity(provinceId)
        }
        if(name==='city'){
            await this.getSelectedCity(value)
            const zipcode = await this.state.selectedCity.postal_code
            await this.setState({zipcode: zipcode})
            await this.setShipmentCost(this.state.courier)
        }
        if(name==='courier'){
            await this.setShipmentCost(value)
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

    setAddress = async(id) =>{
        let address;
        this.state.listAddress.forEach(item => {
            if(item.id===parseInt(id)){
                address = item
            }
        });
        if(address!==undefined){
            await this.setState({
                contact: address.contact,
                details: address.details,
                city: address.city,
                province: address.province,
                country: address.country,
                zipcode: address.zipcode
            })
            await this.getSelectedProvince(address.province);
            const provinceId=await this.state.selectedProvince.province_id
            await this.props.getCity(provinceId);
            await this.getSelectedCity(address.city);
        }
    }

    getAddress = async() =>{
        const input = {
            method: 'get',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+"user/address/list",
        }
        await this.props.handleApi(input);
        const addresses = await this.props.data.result;
        console.log(addresses)
        if(addresses!==undefined){
            await this.setState({listAddress:addresses})
            this.props.handleReset()
        }
    }

    getShipmentCost = async(data) => {
        const input = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
            url: this.props.baseUrl+'shipment/cost',
            params: data
        };
        await this.props.handleApi(input)
        data = await this.props.data
        if(data!==undefined){
            await this.setState({shipmentCost:data.result})
        }
    }

    setShipmentCost = async (value) => {
        if(value==='Our Courier'){
            await this.setState({shipmentCost: 25000})
        } else {
            const courierName = await value==='POS Indonesia'? 'pos' : await value.toLowerCase()
            const data = {
                destination: await this.state.selectedCity.city_id,
                courier: courierName
            }
            await this.getShipmentCost(data);
        }
    }

    postOrder = async(dict) =>{
        const input = {
            method: "post",
            url: await this.props.baseUrl+"order",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            data: dict,
            validateStatus: (status) => {
                return status<500
            }
        };
        await this.props.handleApi(input)
        const data = await this.props.data
        await this.setState({order:data.result})
        this.props.handleReset()
    }

    postAddress = async (dict) =>{
        const input = {
            method: 'Post',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            url: await this.props.baseUrl+'user/address',
            data: dict,
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input)
        const data = await this.props.data
        await this.setState({newAddress:data.id})
        this.props.handleReset()
    }
    
    postOrderDetails = async() =>{
        const cart = JSON.parse(localStorage.getItem('cart'))
        if(Array.isArray(cart)){
            cart.forEach(async item => {
                const input = {
                    method: "post",
                    url: await this.props.baseUrl+"order/detail",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem('token')
                    },
                    data: {
                        order_id: this.state.order.id,
                        product_id: item.data.id,
                        qty: item.qty,
                        tot_price: item.qty*item.data.price
                    },
                    validateStatus: (status) => {
                        return status<500
                    }
                };
                await this.props.handleApi(input)
            });
        }
        this.props.handleReset()
    }

    validateAddress = async () => {
        const warning1 = document.getElementById('warning1')
        if(this.state.contact===''){
            warning1.innerHTML='Please fill in your contact number'
        } else if(this.state.details===''){
            warning1.innerHTML='Please fill in your address details'
        } else if(this.state.city===''){
            warning1.innerHTML='Please fill in your address city'
        } else if(this.state.province===''){
            warning1.innerHTML='Please fill in your address province'
        } else if(this.state.zipcode===''){
            warning1.innerHTML='Please fill in your address zipcode'
        } else {
            const data = {
                contact: this.state.contact,
                details: this.state.details,
                city: this.state.city,
                province: this.state.province,
                zipcode: this.state.zipcode,
            }
            await this.postAddress(data);
        }
    }

    handleCheckout = async (totPrice, totQty) => {
        const warning1 = document.getElementById('warning1')
        const warning2 = document.getElementById('warning2')
        const warning3 = document.getElementById('warning3')
        if(this.state.address==='new'){
            this.validateAddress()
        }
        if (this.state.address===''){
            warning2.innerHTML=""
            warning3.innerHTML=""
            warning1.innerHTML="Please choose your address"
        } else if (this.state.courier===''){
            warning1.innerHTML=""
            warning3.innerHTML=""
            warning2.innerHTML="Please choose your Shipping Method"
        } else if (this.state.payment===''){
            warning1.innerHTML=""
            warning2.innerHTML=""
            warning3.innerHTML="Please choose your Payment Method"
        } else {
            swal.fire({
                title: 'Confirmed?',
                text: 'Do you want to proceed with your checkout?',
                icon: 'question',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                confirmButtonColor: '#b36232',
                cancelButtonColor: '#c6381f',
                showCancelButton: true
            }).then(result => {
                if(result.value){
                    swal.fire({
                        title: 'Processing your order....',
                        timer: 3000,
                        onBeforeOpen: async () => {
                            swal.showLoading()
                            const addressId = await this.state.address==='new'? this.state.newAddress : this.state.address
                            const data = {
                                tot_price: totPrice,
                                tot_qty: totQty,
                                address_id: addressId,
                                shipping: await this.state.courier,
                                payment: await this.state.payment,
                                shipping_price: await this.state.shipmentCost,
                                finished: true
                            }
                            await this.postOrder(data)
                            await this.postOrderDetails()
                        },
                        onClose: async () => {
                            let text;
                            if(this.state.payment==='Transfer'){
                            text = '<div class="inside-alert">'+
                                '<h5>You have choosen Transfer for payment</h5>'+
                                '<h6>Please send Rp'+totPrice+'.00 to the bank account details below</h6>'+
                                '<h3>9000031601892</h3>'+
                                '<p>Mandiri a.n. Azzahra Lamuri</p></div>'
                            } else if(this.state.payment==='Cash-on-Delivery') {
                            text = '<div class="inside-alert">'+
                                '<h5>You have choosen Cash-on-Delivery for payment</h5>'+
                                '<h6>Sit tight and wait until our courier inform you further about your delivery</h6>'+
                                '<h3>Have a nice day!</h3>'+
                                '<p>ps: prepare exact amount of money(Rp'+totPrice+'.00)</p></div>'
                            }
                            swal.fire({
                            title: 'Order Processed!',
                            html: text,
                            icon: 'info',
                            confirmButtonText: 'Roger',
                            confirmButtonColor: '#b36232',
                            })
                            localStorage.removeItem('cart')
                            this.props.history.push('/')
                        }
                    })
                } 
            })
        }
    }

    render(){
        const cart = JSON.parse(localStorage.getItem('cart'))
        let dataToShow, product=0, shipment=0, totPrice, totQty=0;
        console.log(this.state.address)
        if(Array.isArray(cart)&&cart.length>0){
            console.log('inside if')
            dataToShow = cart.map((item)=>{
                return(
                    <CheckoutProductList
                        name={item.data.name}
                        image={item.data.image}
                        price={item.data.price}
                        qty={item.qty}/>
                )
            })
            cart.forEach(item => {
                product += (item.data.price*item.qty) 
                totQty += item.qty
            });
        }
        shipment=this.state.shipmentCost;
        totPrice=product+shipment;
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1>Shopping Checkout</h1>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-7 checkout-product mb-5">
                            <table>
                                <thead>
                                    <td className="product">Product List</td>
                                    <td className="price">Price</td>
                                </thead>
                                {dataToShow}
                                <tr className="tot-product">
                                    <td className="product">Total Product:</td>
                                    <td className="price">Rp{product}.00</td>
                                </tr>
                                <tr className="shipping-cost">
                                    <td className="product">Shipment Cost:</td>
                                    <td className="price">Rp{shipment}.00</td>
                                </tr>
                                <tfoot>
                                    <td className="product">Total Cost:</td>
                                    <td className="price">Rp{totPrice}.00</td>
                                </tfoot>
                            </table>
                        </div>
                        <div className="col-md-5 p-4">
                            <div className="details-checkout">
                                <div className="address">
                                    <h6 className="font-weight-bold">Input your address:</h6>
                                    <p id="warning1"></p>
                                    <form onSubmit={e=>e.preventDefault()}>
                                        <select name="address" className="mb-2"
                                        onChange={e=>this.handleInput(e)} value={this.state.address}>
                                            <option value="" selected disabled>Select Address</option>
                                            {Array.isArray(this.state.listAddress)?
                                            this.state.listAddress.map((item, key)=>(
                                                <option value={item.id}>{key+1}: {item.details}</option>
                                            ))
                                            :null
                                            }
                                            <option value="new">New Address...</option>
                                        </select> 
                                        {this.state.address==='new'?
                                            <AddressForm
                                            contact={this.state.contact} 
                                            details={this.state.details} 
                                            city={this.state.city} 
                                            province={this.state.province} 
                                            zipcode={this.state.zipcode} 
                                            cityList={this.props.cityList} 
                                            provinceList={this.props.provinceList} 
                                            handleInput={this.handleInput}/>
                                        : null
                                        }
                                    </form>
                                </div>
                                <div className="address">
                                    <h6 className="font-weight-bold">Select Courier:</h6>
                                    <p id="warning2"></p>
                                    <form onSubmit={e=>e.preventDefault()}>
                                        <select name="courier" onChange={e=>this.handleInput(e)} value={this.state.courier}>
                                            <option value="" selected disabled>Select Courier</option>
                                            <option value="JNE">JNE</option>
                                            <option value="TIKI">TIKI</option>
                                            <option value="POS Indonesia">POS Indonesia</option>
                                            {this.state.province==='DKI Jakarta'?
                                            <option value="Our Courier">Our Courier</option>
                                            :null}
                                        </select>
                                    </form>
                                </div>
                                <div className="address">
                                    <h6 className="font-weight-bold">Select Payment Method:</h6>
                                    <p id="warning3"></p>
                                    <form onSubmit={e=>e.preventDefault()}>
                                        <select name="payment" onChange={e=>this.handleInput(e)} value={this.state.payment}>
                                            <option value="" selected disabled>Select Payment Method</option>
                                            {this.state.province==='DKI Jakarta'?
                                                <option value="Cash-on-Delivery">Cash-on-Delivery</option>
                                            :null}
                                            {this.state.courier==='Our Courier'? null:<option value="Transfer">Transfer</option>}
                                        </select>
                                    </form>
                                </div>
                                <div className="finish-checkout">
                                    <h6 className="font-weight-bold text-center">Total Quantity: {totQty}</h6>
                                    <h6 className="font-weight-bold text-center mb-3">Total Payment: Rp{totPrice}.00</h6>
                                    <div className="button-box">
                                        <Link className="btn btn-danger btn-cancel" onClick={this.handleCancel}>
                                            <i className="material-icons">clear</i>
                                            <span>Cancel</span>
                                        </Link>
                                        <Link className="btn btn-danger btn-payment" onClick={()=>this.handleCheckout(totPrice,totQty)}>
                                            <span>Payment</span>
                                            <i className="material-icons">navigate_next</i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect('categoryList, baseUrl, data, cityList, provinceList', actions)(withRouter(CheckOut))