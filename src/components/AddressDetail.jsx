import React from 'react';
import { Link } from 'react-router-dom';

const AddressDetail = (props) =>{
    return(
        <React.Fragment>
            <div className="row address-box">
                <div className="col-md-9">
                    <h4>Address{props.index+1}</h4>
                    <p>{props.details}, {props.city}</p>
                    <p>{props.province}, {props.country} {props.zipcode}</p>
                    <p>Contact: {props.contact}</p>
                </div>
                <div className="col-md-3">
                    <Link className="btn btn-danger btn-edit" to={"/user/address/edit/"+props.id}>
                        <i className="material-icons">edit</i>
                    </Link>
                    <Link className="btn btn-danger btn-del" onClick={()=>props.handleDeleteItem(props.id)}>
                        <i className="material-icons">delete</i>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddressDetail