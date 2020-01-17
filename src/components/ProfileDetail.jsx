import React from 'react';
import { Link } from 'react-router-dom';

const ProfileDetail = (props) =>{
    return(
        <React.Fragment>
            <div className="profile-detail">
                <div className="name-box">
                    <h1>{props.username}</h1>
                    <Link to="/user/detail/edit"><i className="material-icons">edit</i></Link>
                </div>
                <div className="detail-box">
                    <table>
                        <tr>
                            <th>First Name</th><td>:</td><td> {props.fname}</td>
                        </tr>
                        <tr>
                            <th>Last Name</th><td>:</td><td> {props.lname}</td>
                        </tr>
                        <tr>
                            <th>Gender</th><td>:</td><td> {props.gender}</td>
                        </tr>
                        <tr>
                            <th>Birth Date</th><td>:</td><td> {props.birthDate}</td>
                        </tr>
                        <tr>
                            <th>Email</th><td>:</td><td> {props.email}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfileDetail