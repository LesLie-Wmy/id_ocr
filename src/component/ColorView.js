import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../langs'

import { fetchData } from '../actions/fetch';

class ColorView extends Component {
  constructor(props){
    super(props);
    this.state={
      onLoading:true,
      color:"#ffffff00"
    }
  }

  componentDidMount(){
    this.props.fetchData({
      start:'FETCH_PRODUCT_Color_START',
      next:'FETCH_PRODUCT_Color_SUCCESS', 
      rejected:'FETCH_PRODUCT_Color_ERROR', 
      method:'POST',
      url:'/products/attr/color/'+this.props.colorId,
      data:{
        "lang":I18n.currentLocale()
      },
      callback:(data, isError)=>this.onInit(data, isError)
    });
  }

  onInit(data, isError){
    if(isError){

    }else{
      if(data.status=="success"){
        this.setState({
          onLoading:false,
          color:data.data.value.value
        })
      }
      
    }
  }

  render() { 
    if(this.state.onLoading){
      return (
        <View style={[styles.container, this.props.style]} />
      );
    }else{
      return (
        <View style={[styles.container, this.props.style, {backgroundColor:this.state.color}]}>
        </View>
      );
    }
    
  }
}
 
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height:'100%',
    borderRadius:5,
  }
});
 
 
const mapStateToProps = ({  }) => ({  });
export default connect(mapStateToProps, { fetchData })(ColorView);