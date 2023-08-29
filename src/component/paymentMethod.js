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

// create a component
class PaymentMethod extends Component {
  constructor(props){
    super(props);
    // this.state={
    //   method:this.props.method,
    // }
    this.state = {
      ...props
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      ...props
    })
  }

  render() {
    return (
      <View  style={{width:'100%'}}>
        <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'center', color:global.styles.textLight3}}>{I18n.t('Payment Method')}</Text>
          {
            this.renderPayment()
          }
      </View>
      
    );
  }

  renderPayment(){
    let payments = [];
    console.log(global.paymentMethod);
    this.state.method.forEach((method, index) => {
      if(global.paymentMethod[method.code]){
        payments.push(this.renderItems({...method,
                      key:index,
                      image:global.paymentMethod[method.code].image, 
                      method:global.paymentMethod[method.code].methodName
                    })) ;
      }else{
        payments.push(<View key={index} />);
      }
    });

    return payments;
  }

  renderItems(data){
    return (
      <TouchableOpacity 
        key={data.key}
        style={styles.container}
        onPress={() => this.props.onCheck(data.method, data.code)}
        >
        <Image 
          source={data.image}
          style={{width:50, height:50}} 
          />
        <View style={{flex:1, alignItems: 'flex-start', justifyContent: 'center',}}>
          <Text style={{fontSize:19 * global.scale, marginLeft:10, fontWeight:'500', color:global.styles.textLight1}}>{data.title}</Text>
        </View>
        {
          this.state.value==data.method?
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
    margin: 10,
    marginLeft: 0,
    marginRight: 10,
  },
});

//make this component available to the app
export default PaymentMethod;
