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
        search: '',
        error: false,
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
        this.props.handleReset()
    }

    handleInput = (event) => {
        this.setState({ [event.target.name] : event.target.value })
    }

    componentWillUpdate = async () => {
        const action = await this.props.match.params.action;
        if(action==='search'){
            const search = await this.props.search
            if(search!==this.state.search){
                await this.setState({isLoading: true, error: false})
            }
        } else if(action==='category'){
            let input = await this.props.match.params.input
            if(input!==undefined){
                input = input.replace('+', ' ')
                if(input!==this.state.category){
                    await this.setState({isLoading: true, error: false})
                }
            }
        }
    }

    componentDidUpdate = async () =>{
        const action = await this.props.match.params.action;
        if(action==='search'){
            const search = await this.props.search
            if(search!==this.state.search){
                await this.props.handleReset()
                await this.getItemBySearch();
                await this.setState({category: ''})
            }
        } else if(action==='category'){
            let input = await this.props.match.params.input
            if(input!==undefined){
                input = input.replace('+', ' ')
                if(input!==this.state.category){
                    console.log(input, this.state.category)
                    await this.props.handleReset()
                    await this.getItemByCategory(input)
                    await this.props.handleError()
                    await this.setState({search:''})
                }
            }
        }
    }

    handleCategory = async (category) => {
        this.props.history.push('/item/category/'+category.replace(' ','+').toLowerCase())
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
        await this.setState({category:category})
        const categoryId = await this.getCategoryID(category);
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
            await this.setState({isLoading: false, error:false})
        } else if(this.props.error!==undefined){
            await this.setState({isLoading: false, error: true})
        }
    }

    getItemBySearch = async() =>{
        const search = await this.props.search
        await this.setState({search:search})
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
            await this.setState({isLoading: false, error:false})
        } else if(this.props.error!==undefined){
            await this.setState({isLoading: false, error: true})
        }
    }

    render(){
        let data = this.props.data
        if(data!==undefined){
            data = this.props.data.result
        }
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
        } else if(this.props.error!==undefined){
            dataToShow = <div className="loading-box"><h3>{this.props.error.data.message}</h3></div>
        } else if(this.state.error){
            dataToShow = <div className="loading-box"><h3>No product available</h3></div>
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