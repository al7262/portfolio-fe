import React from 'react';

const AddressForm = (props) =>{
    return(
        <React.Fragment>
            <input name="contact" type="text" placeholder="Contact Number" onChange={e => props.handleInput(e)} value={props.contact}/>
            <textarea name="details" placeholder="Street Details" onChange={e => props.handleInput(e)} value={props.details}/>
            <input name="city" type="text" placeholder="City Name" onChange={e => props.handleInput(e)} value={props.city}/>
            <input name="province" type="text" placeholder="Province Name" onChange={e => props.handleInput(e)} value={props.province}/>
            <input name="country" type="text" placeholder="Country Name" onChange={e => props.handleInput(e)} value={props.country}/>
            <input name="zipcode" type="text" placeholder="Zipcode" onChange={e => props.handleInput(e)} value={props.zipcode}/>
        </React.Fragment>
    );
};

export default AddressForm
