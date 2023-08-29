//import liraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Image,
  TouchableOpacity
 } from 'react-native';
 import {
  Icon
 } from 'native-base';
 import I18n from '../langs';
 import RenderPrice from './RenderPrice';

// create a component
class ShippingMethod extends Component {
  constructor(props){
    super(props);
    this.state={
      amount:0
    }
  }

  onCheck(carrier_code, method_code, amount){
    this.setState({
      amount:amount
    });
    this.props.onCheck(carrier_code, method_code, amount);
  }

  render() {
    return (
      <View  style={{width:'100%'}}>
        <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'center', color:global.styles.textLight3}}>{I18n.t('Shipping Method')}</Text>
        <View>
          {
            this.renderShipping()
          }
        </View>
        {
          this.state.amount > 0
          ?
          <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'flex-end'}}>
            <View style={{flex:1, }}/>
            <Text style={{fontSize:16 * global.scale, fontWeight:'400', color:global.styles.textLight3}}>{I18n.t('Shipping Rate')}:</Text> 
            <View style={{marginLeft:5, marginRight:10}}>
              <RenderPrice
                fontSize={20  * global.scale}
                oldPriceTxt={{alignSelf:'flex-end', alignItems:'flex-end', justifyContent:'flex-end'}}
                price={this.state.amount}
                sprice={undefined}
                from={undefined}
                to={undefined}
                dateNow={undefined}
              />
            </View>
          </View>
          :
          <View/>
        }
      </View>
      
    );
  }

  renderShipping(){
    let shipping = [];
    this.props.method.forEach(method => {      
      shipping.push( this.renderItems(method) );
      }
    );

    return shipping;
  }

  renderItems(data){
    let payments = [];
    return (
      <TouchableOpacity 
        style={styles.container}
        onPress={() => this.onCheck(data.carrier_code, data.method_code, data.amount)}
        >
        <View style={{flex:1, alignItems: 'flex-start', justifyContent: 'center',}}>
          <Text style={{fontSize:20 * global.scale, marginLeft:10, fontWeight:'bold', color:global.styles.textLight1}}>{data.carrier_title}</Text>
          <Text style={{fontSize:16 * global.scale, marginLeft:10, marginRight:10, marginTop:4, fontWeight:'500', color:global.styles.textLight3}}>{data.method_title}</Text>
        </View>
        <View>
          <Text style={{fontSize:18, marginLeft:5, marginRight:10, marginTop:4, fontWeight:'500', color:global.styles.textLight3}}>+${data.amount}</Text>
        </View>
        {
          this.props.value==data.method_code?
          <Icon type='Feather' name='check-circle' style={{fontSize:25, color:global.styles.textLight1}} />:
          <Icon type='Feather' name='circle' style={{fontSize:25, color:global.styles.textLight3}} />
        }
      </TouchableOpacity>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 13,
    marginLeft: 0,
    marginRight: 10,
    marginBottom: 20
  },
});

//make this component available to the app
export default ShippingMethod;
