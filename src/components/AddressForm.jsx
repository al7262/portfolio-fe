import React from 'react';

const AddressForm = (props) =>{
    return(
        <React.Fragment>
            <input name="contact" type="text" placeholder="Contact Number" onChange={e => props.handleInput(e)} value={props.contact}/>
            <textarea name="details" placeholder="Street Details" onChange={e => props.handleInput(e)} value={props.details}/>
            <select name="province" onChange={e=>props.handleInput(e)}>
                <option value="" selected disabled>Select Province</option>
                {Array.isArray(props.provinceList)?
                props.provinceList.map((item)=>(
                    <option value={item.province}>{item.province}</option>
                ))
                :null
                }
            </select> 
            <select name="city" onChange={e=>props.handleInput(e)}>
                <option value="" selected disabled>Select City</option>
                {Array.isArray(props.cityList)?
                props.cityList.map((item)=>(
                    <option value={item.city_name}>{item.city_name}</option>
                ))
                :null
                }
            </select> 
            <input name="zipcode" maxLength="5" type="text" placeholder="Zipcode" onChange={e => props.handleInput(e)} value={props.zipcode}/>
        </React.Fragment>
    );
};

export default AddressForm
