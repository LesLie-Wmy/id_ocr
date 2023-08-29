import React, { Component } from 'react';
import { 
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  Left,
  Body,
  Right
} from 'native-base'
import { Actions, } from 'react-native-router-flux'
import Image from "./ResponsiveImage";
const win = Dimensions.get("window")

export default class TopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TopUp:this.props.TopUp,
      Price:0
    };
  }

  _showTopUp(Price){
    this.setState({
      TopUp:true,
      Price:Price
    })
  }

  _hideTopUp(){
    this.setState({
      TopUp:false
    })
  }

  _paypal(){
    this._hideTopUp();
    Actions.Receipt();
    // PayPal.initialize(PayPal.SANDBOX, "AcyfHnDJwGjUpoeCPYHn7xvX8eOYmIFbpi0Ra8V4jtGiHrNhVILRXP_PGbkIO1sD9hHPFOY0lCEKyWiL");
    // PayPal.pay({
    //   price: '40.70',
    //   currency: 'MYR',
    //   description: 'Your description goes here',
    // }).then(confirm => console.log(confirm))
    //   .catch(error => console.log(error));
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={this.state.TopUp}
        style={styles.container}
        onRequestClose={ () => this._hideTopUp()}
      >
        <View style={styles.modalView}>
          <View style={{ flexDirection:'row', padding:10, borderBottomWidth:1, borderColor:'#00c5ff'}}>
            <Left><Text style={{ color:'#7f96d6', fontSize:18}}>{"$ " + this.state.Price}</Text></Left>
            <Body><Text style={{ color:'#7f96d6', fontSize:18}}>{this.props.title}</Text></Body>
            <Right><TouchableOpacity onPress={ () => this._hideTopUp()}><Text style={{ color:'#7f96d6', fontSize:18}}>I18nClose</Text></TouchableOpacity></Right>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
            <View style={{ padding:10, justifyContent:'center', alignItems:'center', padding:0 }}>
              <TouchableOpacity onPress={ () => this._paypal()} style={{ width:150, height:125, borderWidth:2, borderColor:"#00c5ff", borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                <Image source={"https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png"} style={{ width:125,height:30}} /> 
              </TouchableOpacity>
            </View>
            <View style={{ padding:10,  justifyContent:'center', alignItems:'center', }}>
              <TouchableOpacity style={{ width:150, height:125, borderWidth:2, borderColor:"#00c5ff", borderRadius:10, justifyContent:'center', alignItems:'center',}}>
                <Image source={require("../images/alipayhk.png")} style={{width:125, height:75}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(192,192,192,0.9)',
  },
  modalView :{
    position:'absolute',
    flex:1,
    width:win.width,
    height:210,
    bottom:0,
    left:0,
    borderTopLeftRadius :0,
    borderTopRightRadius :0,
    borderWidth:1,
    borderColor:'#00c5ff',
    backgroundColor:'rgba(255,255,255,1)'
  },
})