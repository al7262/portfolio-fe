import React from 'react';

const ProductForm = (props) =>{
    return(
        <React.Fragment>
            <input name="name" type="text" placeholder="Name" onChange={e => props.handleInput(e)} value={props.name}/>
            <textarea name="description" onChange={e => props.handleInput(e)} placeholder="Description" value={props.description}/>
            <select name="category" onChange={e=>props.handleInput(e)}>
                <option value="" selected disabled>Select Category</option>
                {Array.isArray(props.categoryList)?
                props.categoryList.map((item)=>(
                    <option value={item.id}>{item.name}</option>
                ))
                :
                null
                }
            </select> 
            <input name="image" type="text" onChange={e => props.handleInput(e)} placeholder="Image Url" value={props.image}/>
            <input name="stock" type="number" onChange={e => props.handleInput(e)} placeholder="Stock" value={props.stock}/>
            <input name="price" type="text" onChange={e => props.handleInput(e)} placeholder="Price" value={props.price}/>
        </React.Fragment>
    );
};

export default ProductForm
