import React, { Component } from 'react';
import {   
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import {
  Left,
  Body,
  Right,
  Button,
  Icon
} from 'native-base'
import { Actions } from 'react-native-router-flux'
const win = Dimensions.get("window")

export class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (
      <View style={{width:win.width, flexDirection:"row", marginTop:5, height:50, justifyContent:'center', alignItem:'center',  backgroundColor:'transparent'}}>
        <Left style={{ flex:0.2 }}>
          {
            this.props.renderLeft ?
            this.props.renderLeft :
            <TouchableOpacity transparent style={{paddingLeft:10,paddingRight:10}} onPress={ () => Actions.pop()}>
              <Icon name="ios-arrow-back" style={{fontSize:30,color:this.props.titleColor ? this.props.titleColor : '#fff'}} />
            </TouchableOpacity>
          }
        </Left>
        <Body style={{ flex:1 }}>
          <Text numberOfLines={1}  style={{ color: this.props.titleColor ? this.props.titleColor : "white", overflow:'hidden', fontSize:20, fontWeight:"bold", height:28}}>{this.props.title}</Text>
        </Body>
        <Right style={{ flex:0.2 }}>
          {
            this.props.renderRight ? 
            this.props.renderRight :
            null
          }
        </Right>
      </View>
    );
  }
}

export default MyHeader