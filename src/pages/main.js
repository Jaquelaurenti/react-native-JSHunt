import React,  { Component } from 'react';
import api from '../services/api'

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default class Main extends Component {
    static navigationOptions = {
        title: "JSHunt"
    };

    // trabalhando com o conceito de estado
    state ={
        productInfo:{},
        docs: [],
        page: 1,
    };

    // metodo que dispara automaticamente no react, neste caso iremos chamar a api
    componentDidMount(){
        this.loadProducts()
    }

    loadProducts = async (page = 1) =>{

        const response = await api.get(`/products?page=${page}`)

        // utlizando desestruturacao vamos pegar o que vem no response 
        const { docs, ...productInfo } = response.data;

        this.setState({ 
            docs: [...this.state.docs, ...docs], 
            productInfo,
            page 
        });


    }

    renderItem = ({ item }) => (
        <View style={style.productContainer}>
            <Text style={style.productTitle}>{item.title}</Text>
            <Text style={style.productDescription}>{item.description}</Text>
            <TouchableOpacity 
                style={style.productButton} 
                onPress={()=> {
                    this.props.navigation.navigate("Products", {  product: item });
                }}>
                <Text style={style.productButtonText}>Acessar</Text>
            </TouchableOpacity>
            
        </View>
    );

    loadMore = () => {
        const { page, productInfo } = this.state;

        if(page === productInfo.pages) return;

        const pageNumber = page +1;

        this.loadProducts(pageNumber);

    };

    render(){
        return (
            <View style ={style.container}>
                <FlatList 
                contentContainerStyle={style.list}
                data={this.state.docs}
                keyExtractor={item => item._id}
                renderItem={this.renderItem}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.1}
                />
            </View>
        );
    }
}


const style = StyleSheet.create({
    container:{
        backgroundColor:"#fafafa",
        flex:1
    },

    list:{
        padding: 20
    },

    productContainer:{
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 5,
        padding: 20,
        marginBottom: 20
    },

    productTitle:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#333"
    },

    productDescription:{
        fontSize: 16,
        color: "#999",
        marginTop: 5,
        lineHeight: 24
    },

    productButton:{
        height:42,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#DA552F",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },

    productButtonText:{
        fontSize: 15,
        color: "#DA552F",
        fontWeight: "bold"
    }
});