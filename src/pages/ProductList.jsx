import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import CategoryForm from '../components/CategoryForm';

class ProductDetails extends React.Component{
    state = {
        isLoading: true,
        qty: 1,
        category: ''
    }

    componentDidMount = async () => {
        await this.props.checkLoginStatus()
        await this.props.getCategory()
        console.log(this.props)
        const action = await this.props.match.params.action.toLowerCase()
        if(action==='category'){
            await this.getItemByCategory()
        } else if(action==='search'){
            await this.getItemBySearch()
        }
        const data = this.props.data
        if(data!==undefined){
            this.setState({isLoading: false})
        }
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    handleCategory = async (category) => {
        this.setState({category:category.toLowerCase()});
        this.props.history.push('/item/category/'+category.replace(' ','+').toLowerCase())
        await this.getItemByCategory()
    }

    getCategoryID = (category) => {
        let id;
        const categoryList = this.props.categoryList
        if(Array.isArray(categoryList)){
            for(const item in categoryList){
                if(categoryList[item].name.toLowerCase()===category){
                    id=categoryList[item].id
                }
            }
        }
        return id
    }

    getItemByCategory = async() =>{
        const category = await this.props.match.params.input.replace('+', ' ')
        this.setState({category:category})
        const categoryId = await this.getCategoryID(category);
        console.log(categoryId)
        const input = {
            method: "get",
            url: "http://0.0.0.0:5000/product/list",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                category_id: categoryId
            },
        }
        await this.props.handleApi(input)
    }

    getItemBySearch = async() =>{
        const search = await this.props.search
        const input = {
            method: "get",
            url: "http://0.0.0.0:5000/product/list",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                name: search
            },
        }
        await this.props.handleApi(input)
    }

    render(){
        const data = this.props.data
        const action = this.props.match.params.action
        let input;
        if(action==='category'){
            input = this.props.match.params.input.replace('+', ' ')
        }
        return(
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row col-12 product-title mt-5">
                        <h1 className="text-capitalize">{action}: {action==='category'? input : this.props.search}</h1>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-3 side-bar vl-manage mb-2">
                            <div class="list-group list-group-flush">
                                {Array.isArray(this.props.categoryList)?
                                this.props.categoryList.map((item)=>(
                                <Link class={"list-group-item list-group-item-action "+(input===item.name.toLowerCase()? 'active':'')}
                                onClick={()=>this.handleCategory(item.name)}>
                                    {item.name}</Link>
                                ))
                                : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect('data, categoryList, search',actions)(withRouter(ProductDetails))