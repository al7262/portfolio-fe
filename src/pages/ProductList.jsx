import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "../store/store";

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProductItemList from '../components/ProductItemList';

class ProductDetails extends React.Component{
    state = {
        isLoading: true,
        qty: 1,
        category: '',
        search: ''
    }

    componentDidMount = async () => {
        await this.props.checkLoginStatus()
        await this.props.getCategory()
        // console.log(this.props)
        const action = await this.props.match.params.action
        if(action==='category'){
            await this.getItemByCategory()
        } else if(action==='search'){
            await this.getItemBySearch()
        }
    }

    // reset data in store to empty
    componentWillUnmount = async () =>{
        await this.props.handleChange('data', '');
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    componentDidUpdate = async () => {
        // console.warn('this is inside did update')
        const action = await this.props.match.params.action;
        // console.log(action)
        if(action==='search'){
            const search = await this.props.search
            if(search!==this.state.search){
                await this.props.handleChange('data', '')
                await this.setState({isLoading: true})
            }
        } else if(action==='category'){
            let input = await this.props.match.params.input
            if(input!==undefined){
                input = input.replace('+', ' ')
                if(input!==this.state.category){
                    await this.props.handleChange('data', '')
                    await this.setState({isLoading: true})
                }
            }
        }
    }

    componentWillUpdate = async () =>{
        // console.warn('this is inside will update')
        const action = await this.props.match.params.action;
        // console.log(action)
        if(action==='search'){
            const search = await this.props.search
            if(search!==this.state.search){
                await this.getItemBySearch();
            }
        } else if(action==='category'){
            let input = await this.props.match.params.input
            if(input!==undefined){
                input = input.replace('+', ' ')
                if(input!==this.state.category){
                    await this.getItemByCategory()
                }
            }
        }
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
        let category = await this.props.match.params.input
        if(category!==undefined){
            category=category.replace('+', ' ')
        }
        this.setState({category:category})
        const categoryId = await this.getCategoryID(category);
        // console.log(categoryId)
        const input = {
            method: "get",
            url: await this.props.baseUrl+"product/list",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                category_id: categoryId
            },
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input)
        const data = await this.props.data
        if(data!==undefined){
            this.setState({isLoading: false})
        } else if(this.props.error.hasOwnProperties('message')){
            this.setState({isLoading: false})
        }
    }

    getItemBySearch = async() =>{
        const search = await this.props.search
        this.setState({search:search})
        const input = {
            method: "get",
            url: await this.props.baseUrl+"product/list",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                name: search
            },
            validateStatus: (status) => {
                return status<500
            }
        }
        await this.props.handleApi(input)
        const data = await this.props.data
        if(data!==undefined){
            this.setState({isLoading: false})
        } else if(this.props.error.hasOwnProperties('message')){
            this.setState({isLoading: false})
        }
    }

    render(){
        const data = this.props.data
        const action = this.props.match.params.action
        let input = this.props.match.params.input
        let dataToShow;
        // console.log(this.props)
        if(action==='category'){
            if(input!==undefined){
                input = input.replace('+', ' ')
            }
        }
        if(Array.isArray(data)){
            dataToShow = data.map((item, key)=>{
                return(
                    <ProductItemList
                        key={key}
                        name={item.name}
                        price={item.price}
                        image={item.image}
                        id={item.id}
                        data={item}
                        addToCart={this.props.addToCart}
                    />
                )
            })
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
                        <div className="col-md-3 side-bar vl-manage mb-5">
                            <div className="list-group list-group-flush">
                                {Array.isArray(this.props.categoryList)?
                                this.props.categoryList.map((item,key)=>(
                                <Link key={key} className={"list-group-item list-group-item-action "+(input===item.name.toLowerCase()? 'active':'')}
                                onClick={()=>this.handleCategory(item.name)}>
                                    {item.name}</Link>
                                ))
                                : null
                                }
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                {this.state.isLoading?
                                <div className="loading-box"><i className="material-icons">cached</i></div>
                                :
                                dataToShow
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

export default connect('data, categoryList, search, error, baseUrl',actions)(withRouter(ProductDetails))