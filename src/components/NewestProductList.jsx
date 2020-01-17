import React from 'react';
import { Link } from 'react-router-dom'

const NewestProductList = (props) => {
    return(
        <React.Fragment>
            <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="newest-product-item">
                    <img src={props.image} alt="newest-product"/>
                    <div className="newest-product-name">
                        <Link to={"item/detail/"+props.id}>
                            <h6>{props.title}</h6>
                        </Link>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default NewestProductList
