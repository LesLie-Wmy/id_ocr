//import libraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import {
  Icon,
  Button
} from 'native-base'
import { connect } from 'react-redux';
import I18n from '../langs'
import { fetchingData } from '../actions/fetch';
import { Actions, ActionConst } from 'react-native-router-flux';

// create a component
class PaymentPop extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  payNow(){
    if(Object.keys(this.props.address).length<1 &&  this.props.shipping){
      Alert.alert('',
        I18n.t('Please go to set your shipping address'),
        [
          {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
          {text: I18n.t('Yes'), onPress: () => this.props.onAddressChange()}
        ],
        { cancelable: false })
    }
  }

  addOrder(){
    this.props.fetchingData({
      start:'FETCH_ADD_ORDER_START',
      next:'FETCH_ADD_ORDER_SUCCESS', 
      rejected:'FETCH_ADD_ORDER_ERROR', 
      method:'POST',
      url:'simHome.php', 
      data:{
        "product_id":this.props.product_id,
        "lang":I18n.currentLocale(),
        "action":"getProduct"
      },
      callback:(data,isError) => this.loadCallback(data,isError)
    });
  }

  render() {
    return (
      <Modal transparent animationType="slide" style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end',}}>
        <View style={{flex:1}}></View>
        <View style={styles.container}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', borderBottomColor:global.styles.header, borderBottomWidth:0.4}}>
            <TouchableOpacity onPress={()=>{
                this.props.updateOnPay(false);
                Actions.pop({type:ActionConst.REFRESH});
              }}>
              <Icon type='AntDesign' name='close' style={{fontSize:32 * global.scale, color:global.styles.headerTxt}} />
            </TouchableOpacity>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:24 * global.scale, color:global.styles.headerTxt}}>{I18n.t('Payment Confirm')}</Text>
            </View>
            <Text style={{fontSize:32 * global.scale, color:'#fff'}}>  </Text>
          </View>
          <View style={{flex:1, alignItems:'center', justifyContent:'flex-start'}}>
            {this.props.total.points>0?<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Icon type='Octicons' name="ruby" style={{fontSize: 30  * global.scale, color: global.styles.ruby, marginLeft:10, marginTop:10}}/>
              <Text style={{fontSize:36 * global.scale, color:global.styles.priceTxt, fontWeight:'bold'}}> {global.NumberFormat(this.props.total.spoints?this.props.total.spoints:this.props.total.points)}</Text>
            </View>:null}
            {this.props.total.points>0 && this.props.total.price>0?<View><Icon type='AntDesign' name='plus' style={{fontSize: 22 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:-4, marginTop:-4  }}/></View>:null}
            {this.props.total.price>0?<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Icon type='FontAwesome' name="money" style={{fontSize: 30 * global.scale, color: global.styles.ruby, marginLeft:10, marginTop:10}}/>
              <Text style={{fontSize:36 * global.scale, color:global.styles.priceTxt, fontWeight:'bold'}}> {global.NumberFormat(parseFloat(this.props.total.sprice?this.props.total.sprice:this.props.total.price).toFixed(2))}</Text>
            </View>:null}
          </View>
          <View style={{flexDirection:'row', width:'80%', alignSelf:'center', alignItems:'center', justifyContent:'center', borderBottomColor:'#B0C5FC', borderBottomWidth:1}}>
            <Text style={{fontSize:24 * global.scale, color:global.styles.textLight1}}>{I18n.t('Your Balance')}</Text>
            <Text style={{fontSize:24 * global.scale, color:global.styles.textLight1, marginLeft:10}}>{global.NumberFormat(this.props.balance)}</Text>
            <Icon type='Octicons' name="ruby" style={{fontSize: 24 * global.scale, color: global.styles.ruby, marginLeft:5, marginBottom:0}}/>
          </View>
          {
            this.props.gift?
          <View style={{flexDirection:'row', width:'80%', marginTop:10, alignSelf:'center', alignItems:'center', justifyContent:'center', borderBottomColor:'#B0C5FC', borderBottomWidth:1}}>
            <Icon type='Octicons' name="gift" style={{fontSize: 32 * global.scale, color: global.styles.ruby}}/>  
            <Text style={{fontSize:22 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale, marginTop:5 * global.scale, marginBottom:5 * global.scale}}> {this.props.gift.name}</Text>
            <Text style={{fontSize:22 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}>({this.props.gift.phone})</Text>
          </View>:null
          }
          {/* 
            <TouchableOpacity 
              onPress={()=>this.props.onAddressChange()}
              style={{flexDirection:'row', width:'80%', marginTop:10, alignSelf:'center', alignItems:'center', justifyContent:'center', borderBottomColor:'#B0C5FC', borderBottomWidth:1}}>
              <Icon type='MaterialIcons' name="local-shipping" style={{fontSize: 32 * global.scale, color: global.styles.ruby}}/>
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              {
                Object.keys(this.props.address).length>0?
                <Text style={{fontSize:16 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale, marginTop:5 * global.scale, marginBottom:5 * global.scale}}>{this.props.address.address_1}, {this.props.address.city}</Text>:
                <Text style={{fontSize:16 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}>{I18n.t('Please Set Your Shipping Address')}</Text>
              }
              </View>
              <Icon type='AntDesign' name="right" style={{fontSize: 26 * global.scale, color: global.styles.ruby}}/> 
            </TouchableOpacity> 
          */}
          <View style={{flexDirection:'row', width:'100%'}}>
            <Button 
              onPress={()=>this.payNow()}
              style={{marginTop:10 * global.scale, marginBottom:10 * global.scale, marginLeft:10 * global.scale,  alignSelf:'center', alignItems:'center', justifyContent:'center', backgroundColor:global.styles.btn}}>
              <Text style={{fontSize:22 * global.scale, color:global.styles.textLight4, paddingLeft:30 * global.scale, paddingRight:30 * global.scale}}>{I18n.t('Send Gift')}</Text>
            </Button>
            <Button 
              onPress={()=>this.payNow()}
              style={{marginTop:10 * global.scale, marginBottom:10 * global.scale, marginLeft:10 * global.scale, alignSelf:'center', alignItems:'center', justifyContent:'center', backgroundColor:global.styles.btn}}>
              <Text style={{fontSize:22 * global.scale, color:global.styles.textLight4, paddingLeft:30 * global.scale, paddingRight:30 * global.scale}}>{I18n.t('Pay Now')}</Text>
            </Button>
            <Button 
              onPress={()=>this.payNow()}
              style={{marginTop:10 * global.scale, marginBottom:10 * global.scale, marginLeft:10 * global.scale, alignSelf:'center', alignItems:'center', justifyContent:'center', backgroundColor:global.styles.btn}}>
              <Text style={{fontSize:22 * global.scale, color:global.styles.textLight4, paddingLeft:30 * global.scale, paddingRight:30 * global.scale}}>{I18n.t('ADD CART')}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    height: '55%',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: global.styles.bodyLight,
    borderTopColor: global.styles.textLight3,
    borderTopWidth:2,
  },
});

//make this component available to the app
const mapStateToProps = ({  }) => ({  });
export default connect(mapStateToProps, { fetchingData })(PaymentPop);