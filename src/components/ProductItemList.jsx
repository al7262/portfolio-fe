import React from 'react';
import { Link } from 'react-router-dom'

const ProductItemList = (props)=>{
    return(
        <React.Fragment>
            <div className="col-md-4 col-sm-6 col-12 product-list-box">
                <div className="product-list-img">
                    <img src={props.image} alt=""/>
                </div>
                <div className="product-list-inside">
                    <Link to={"/item/detail/"+props.id}>{props.name}</Link>
                    <div className="product-list-under">
                        <p>Rp{props.price}.00</p>
                        <div className="product-list-btn flex-end">
                            <Link>
                                <i className="material-icons">favorite</i>
                            </Link>
                            <Link onClick={()=>props.addToCart(props.data, 1)}>
                                <i className="material-icons">add_shopping_cart</i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProductItemList
