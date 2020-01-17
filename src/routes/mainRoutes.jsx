import React from 'react';
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { Provider } from 'unistore/react';
import { store } from '../store/store';

import Home from '../pages/Home'
import Login from '../pages/Login'
import NotMatch from '../pages/NotMatch'
import Registration from '../pages/Registration'
import ProductDetails from '../pages/ProductDetails';
import Manage from '../pages/Manage';
import AdminAddEdit from '../pages/AddEditItem';
import Profile from '../pages/Profile';


const Mainroute = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Registration}/>
                    <Route exact path="/manage" component={Manage}/>
                    <Route exact path="/manage/:option" component={Manage}/>
                    <Route exact path="/manage/:option/:action" component={AdminAddEdit}/>
                    <Route exact path="/manage/:option/:action/:index" component={AdminAddEdit}/>
                    <Route exact path="/user" component={Profile}/>
                    <Route exact path="/user/:option" component={Profile}/>
                    <Route exact path="/user/:option/:action" component={AdminAddEdit}/>
                    <Route exact path="/user/:option/:action/:index" component={AdminAddEdit}/>
                    <Route exact path="/item/:index" component={ProductDetails}/>
                    <Route component={NotMatch}/>
                </Switch>
            </BrowserRouter>
        </Provider>
    )
}

export default Mainroute;