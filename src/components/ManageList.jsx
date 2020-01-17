import React from 'react';
import { Link } from 'react-router-dom'

const ManageList = (props) =>{
    return(
        <React.Fragment>
            <tr>
                <td className="text-center">{props.id}</td>
                <td className="pl-3">{props.name}</td>
                <td className="d-flex justify-content-around">
                    {props.position==='product'||props.position==='category'?
                    <Link className="btn btn-danger btn-edit" to={"/manage/"+props.position+"/edit/"+props.id}>
                        <i className="material-icons">edit</i>
                    </Link>
                    :
                    null    
                    }
                    <Link className="btn btn-danger btn-del" onClick={()=>props.handleDeleteItem(props.id)}>
                        <i className="material-icons">delete</i>
                    </Link>
                </td>
            </tr>
        </React.Fragment>
    );
};

export default ManageList
