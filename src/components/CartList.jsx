import React from 'react';
import { Link } from 'react-router-dom'

const CartList = (props)=>{
    return(
        <div className="row cart-box">
            <div className="col-md-3 img-box">
                <img src={props.image} alt="cart-product"/>
            </div>
            <div className="col-md-6 detail-box">
                <h4>{props.name}</h4>
                <h6>Rp{props.price}</h6>
                <p>Quantity:</p>
                <div className="quantity">
                    <Link className="min-btn" onClick={()=>props.updateCart(props.id, -1)}>
                        <i className="material-icons">indeterminate_check_box</i>
                    </Link>
                    <span>{props.qty}</span>
                    <Link className="add-btn" onClick={()=>props.updateCart(props.id, 1)}>
                        <i className="material-icons">add_box</i>
                    </Link>
                </div>
            </div>
            <div className="col-md-3 button-box">
                <div className="btn-del order-lg-0 order-1">
                    <Link className="btn btn-danger" onClick={()=>props.deleteFromCart(props.index)}>
                        <i className="material-icons">delete</i>
                    </Link>
                </div>
                <div className="price order-lg-1 order-0">
                    <p>Total Price:</p>
                    <h5>Rp{props.price*props.qty}.00</h5>
                </div>
            </div>
        </div>

    );
}

export default CartList
