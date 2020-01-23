import React from 'react';

const CheckoutProductList = (props)=>{
    return(
        <tr className="product-list">
            <td className="product">
                <div className="img-box">
                    <img src={props.image} alt="product-checkout"/>
                </div>
                <div className="detail-box">
                    <h3>{props.name}</h3>
                    <h6>Price: Rp{props.price}.00</h6>
                    <h6>Quantity: {props.qty}</h6>
                </div>
            </td>
            <td className="price">
                <h6>Rp{props.price*props.qty}.00</h6>
            </td>
        </tr>
    );
}

export default CheckoutProductList
