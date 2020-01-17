import React from 'react';

const CategoryForm = (props) =>{
    return(
        <React.Fragment>
            <input name="name" type="text" placeholder="Name" onChange={e => props.handleInput(e)} value={props.name}/>
            <textarea name="description" onChange={e => props.handleInput(e)} placeholder="Description" value={props.description}/>
        </React.Fragment>
    );
};

export default CategoryForm
