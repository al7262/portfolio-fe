import React from 'react';

const DetailForm = (props) =>{
    return(
        <React.Fragment>
            <input name="fname" type="text" placeholder="First Name" onChange={e => props.handleInput(e)} value={props.fname}/>
            <input name="lname" type="text" placeholder="Last Name" onChange={e => props.handleInput(e)} value={props.lname}/>
            <select name="gender" onChange={e=>props.handleInput(e)} value={props.gender}>
                <option value="" selected disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
            </select> 
            <input name="image" type="text" onChange={e => props.handleInput(e)} placeholder="Image Url" value={props.image}/>
            <input type="date" min="2003-02-01" name="birthDate" onChange={e => props.handleInput(e)} value={props.birthDate}/>
        </React.Fragment>
    );
};

export default DetailForm
