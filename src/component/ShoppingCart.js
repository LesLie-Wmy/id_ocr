import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  SafeAreaView
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
  Footer,
  FooterTab,
  Spinner
} from 'native-base'
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';
import RNPaypal from 'react-native-paypal-lib';

import QuantitySet from './QuantitySet'
// import ntpClient from 'react-native-ntp-client';

import I18n from '../langs';
import Statusbar from './Statusbar'
import MyHeader from './MyHeader'
import PaymentMethod from './paymentMethod'
import Loading from './loading'
import ImageRP from "./ResponsiveImage";
import ColorView from './ColorView';
import RenderPrice from './RenderPrice';

import { fetchData } from '../actions/fetch'
import { CartCheck, updateCartPrductQty, removeFromCart, updateProductImage, orderCartList } from '../actions/shoppingCart'
var moment = require('moment');
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff'
  }
});
 
class ShoppingCart extends Component {
  constructor(props){
    super(props);
    console.log(props);
    
    this.state={
      // ...props,
      total:{price:0,sprice:0,points:0,spoints:0,totalPrice:0,totalPoints:0},
      address:this.props.user.user.address?this.props.user.user.address:{},
      paymentMethod:null,
    }

    this.props.orderCartList();
  }

  componentDidMount(){
    // ntpClient.getNetworkTime("pool.ntp.org", 123, (error, date) => {
    //   if (error) {
    //       console.error(error);
    //       return;
    //   }else{
    //     console.log(date); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
    //     this.dateNow = moment(date).valueOf();
    //   }
    // });
    fetch(global.storeApiURL+'store/init/')
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      global.dateNow = json;
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  componentWillReceiveProps(props){
    // console.log(props);
    // if(props.onChangeAddressBack){
    //   // this.address=props.address?props.address:this.address;
    //   this.setState({
    //     address:props.address?props.address:this.state.address
    //   })
    // }
  }

  back(){
    if(Actions.state.routes[0].routes.length==3){
      Actions.jump('Main');
    }else if(Actions.state.routes[0].routes.length>3){
      routeName = Actions.state.routes[0].routes[Actions.state.routes[0].routes.length-3].routeName;
      Actions.jump(routeName);
    }else if(Actions.state.routes[0].routes.length<3){
      Actions.pop();
    }
  }

  onCheck(total, quantity, check){
    if(check==1){

      let sprice_on = true;
      let price, sprice;

      if(total.from && moment.parseZone(total.from.replace(" ","T") + "+08:00").utc().valueOf() > total.dateNow){
        sprice_on = false;
      }

      if(total.to && moment.parseZone(total.to.replace(" ","T") + "+08:00").utc().valueOf() < total.dateNow){
        sprice_on = false;
      }
      
      if(total.sprice > 0 && sprice_on){
        sprice = (total.sprice * quantity);
        price = (total.price * quantity);
      }else if(total.price >0){
        sprice = (total.price * quantity);
        price = 0;
      }

      this.state.total={
        price:this.state.total.price + price,
        sprice:this.state.total.sprice + sprice,
        // points:this.state.total.points + (total.points?total.points:0 * quantity),
        // spoints:this.state.total.spoints + (total.spoints * quantity),
        // totalPrice:this.state.total.totalPrice + (((total.sprice?total.sprice:total.price)||0) * quantity),
        // totalPoints:this.state.total.totalPoints + (((total.spoints?total.spoints:total.points)||0) * quantity),
      };
    }
    
  }

  submitOrder(){
    let cartList = [];
    this.props.shoppingCart.cartList.forEach(product => {
      if(product.check==1){
        cartList.push(product);
      }
    });
    setTimeout(() => {
      Actions.PaymentPreview({row:cartList, total:this.state.total});
    }, 10);
  }

  onItemPress(product, i){
    // this.props.CartCheck(i);
    this.refs.Loading.show();
    if(this.props.shoppingCart.cartList[i].check==-1){
      this.props.fetchData({
        start:'FETCH_PRODUCT_EDIT_ADD_CART_START',
        next:'FETCH_PRODUCT_EDIT_ADD_CART_SUCCESS', 
        rejected:'FETCH_PRODUCT_EDIT_ADD_CART_ERROR', 
        method:'POST',
        url:'carts/add/',
        data:{
          "lang":I18n.currentLocale(),
          "sku":product.sku,
          "qty":product.quantity,
          "quote_id":this.props.shoppingCart.id,
          "token":this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired
        },
        callback:(data, isError)=>this.cartCallback({...data, index:i}, isError, 'add')
      });
    }else{
      this.fetchDelete(product, i, 'uncheck');
    }
  }

  fetchDelete(product, index, type){
    if(product.item_id){
      this.props.fetchData({
        start:'FETCH_PRODUCT_DELETE_CART_START',
        next:'FETCH_PRODUCT_DELETE_CART_SUCCESS', 
        rejected:'FETCH_PRODUCT_DELETE_CART_ERROR', 
        method:'POST',
        url:'carts/delete/'+product.item_id,
        data:{
          "lang":I18n.currentLocale(),
          "sku":product.sku,
          "qty":product.quantity,
          "quote_id":this.props.shoppingCart.id,
          "token":this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired
        },
        callback:(data, isError)=>this.cartCallback({...data, index:index, product:product}, isError, type)
      });
    }else{
      this.props.removeFromCart(product);
    }
  }

  cartCallback(data, isError, type){
    this.refs.Loading.hide();
    if(!isError){
      if(type=='del'){
        this.props.removeFromCart(data.product)
      }else{
        this.props.CartCheck(data);
      }
    }else{
      if(data.message){
        if(type=='del'){
          this.props.removeFromCart(data.product)
        }
        setTimeout(() => {
          Alert.alert('',
          I18n.t(data.message, {defaultValue: data.message}),
          [
            {text: I18n.t('OK'), onPress: () => console.log('Cancel Pressed')}
          ],
          { cancelable: false })
        }, 200);
      }else{
        setTimeout(() => {
          Alert.alert('',
          I18n.t('Add item to cart failed Please try again'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
            {text: I18n.t('RETRY'), onPress: () => this.addCart()}
          ],
          { cancelable: false })
        }, 200);
      }
    }
  }

  cartUpdate(product, qty, index){
    this.refs.Loading.show();
    this.props.fetchData({
      start:'FETCH_PRODUCT_UPDATE_CART_START',
      next:'FETCH_PRODUCT_UPDATE_CART_SUCCESS', 
      rejected:'FETCH_PRODUCT_UPDATE_CART_ERROR', 
      method:'POST',
      url:'carts/update/'+product.item_id,
      data:{
        "lang":I18n.currentLocale(),
        "qty":qty,
        "quote_id":this.props.shoppingCart.id,
        "token":this.props.user.user.token,
        'tokenExpired':this.props.user.user.tokenExpired
      },
      callback:(data, isError)=>this.cartUpdateCallback({...data, index:index, qty:qty}, isError)
    });
  }

  cartUpdateCallback(data, isError){
    this.refs.Loading.hide();
    if(!isError){
      this.props.updateCartPrductQty({qty:data.qty, index:data.index});
    }else{
      if(data.message){
        setTimeout(() => {
          Alert.alert('',
          I18n.t(data.message, {defaultValue: data.message}),
          [
            {text: I18n.t('OK'), onPress: () => console.log('Cancel Pressed')}
          ],
          { cancelable: false })
        }, 200);
      }else{
        setTimeout(() => {
          Alert.alert('',
          I18n.t('Add item to cart failed Please try again'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
            {text: I18n.t('RETRY'), onPress: () => this.addCart()}
          ],
          { cancelable: false })
        }, 200);
      }
    }
  }

  fetchProductImage(sku, index){
    this.props.fetchData({
      start:'FETCH_SHOPPING_CART_PRODUCT_IMAGE_START',
      next:'FETCH_SHOPPING_CART_PRODUCT_IMAGE_SUCCESS', 
      rejected:'FETCH_SHOPPING_CART_PRODUCT_IMAGE_ERROR', 
      method:'POST',
      url:'products/media/'+sku,
      data:{
        "lang":I18n.currentLocale()
      },
      callback:(data, isError)=>this.fetchProductImageCallback({...data, index:index}, isError)
    });
    return(
      <View
        style={{ width:110, height:110, resizeMode:'cover' , margin:3}}
        >
        <ImageBackground
          style={{ width:110, height:110, resizeMode:'cover' , margin:3, alignItems:'center', justifyContent:'center'}}
          source={require('../images/empty-image.png')}
        >
        <Spinner size={Platform.OS=="ios"?"large":60} color={'#5d27c5'} />
        </ImageBackground>
      </View>
    )
  }

  fetchProductImageCallback(data, isError){
    this.props.updateProductImage(data);
  }

  

  onLongPress(product){
    Alert.alert("",
      I18n.t("Are you sure you want to delete"),
      [
        {text:I18n.t('Yes'), onPress:()=>this.fetchDelete(product, 0, 'del')},
        {text:I18n.t('No'), onPress:()=>console.log('no')},
      ],
      {cancelable: false},
    )
  }

  

  render_product(){
    var cartList = this.props.shoppingCart.cartList;
    let that = this;
    this.state.total={price:0,sprice:0,points:0,spoints:0,totalPrice:0,totalPoints:0};
    if(cartList.length>0)
      return cartList.map((product, i) => {
        that.onCheck(product.total, product.quantity, product.check)
        return(
          <TouchableOpacity 
            key={i}  
            style={{
              flex:1,
              margin:10, 
              padding:10, 
              marginTop:0,
              borderRadius:10,
              alignItems:'center',
              backgroundColor:global.styles.bodyLight,
              borderColor:'#ddd',
              borderWidth:0.6,
              }}
            onPress={()=>this.onItemPress(product, i)}
            onLongPress={()=>this.onLongPress(product)}
            activeOpacity={0.9}
            >
            <View style={{width:'100%',marginLeft:5, marginRight:5}}>
            <View style={{marginLeft:4, flexDirection:'row', marginTop:5}}>
              <View style={{}}>
                {
                  product.image
                  ?
                  <ImageRP
                      style={{ width:110, height:110, resizeMode:'cover' , margin:3}}
                      loadingStyle={{ size: 'large', color: 'blue' }}
                      placeholderSource={require('../images/empty-image.png')}
                      source={global.storeMediaURL + 'catalog/product' + product.image}
                  />
                  :
                  this.fetchProductImage(product.sku, i)
                  }
              </View>
              <View style={{flex:1,marginLeft:5, marginRight:10}}>
                <Text numberOfLines={4} style={{fontSize:19* global.scale, fontWeight:'400', color:global.styles.text1}}>{product.pname}</Text>
              </View>
              <View style={{alignItems:'center', justifyContent:'center'}}>
              {
                product.check==1?
                <Icon type='Feather' name='check-circle' style={{fontSize:25, color:global.styles.textLight1}} />:
                <Icon type='Feather' name='circle' style={{fontSize:25, color:global.styles.textLight3}} />
              }
              </View>
            </View>
            <View>
              {this.renderProductOptions(product.options)}
            </View>
            <View>
              <View style={{padding:3,  alignItems:'flex-end', justifyContent:'center' }}>
                <View style={{flexDirection:'row',}} >
                  <Text style={{fontSize:16, fontWeight:'400', color:global.styles.textLight3}}>{I18n.t('Quantity')}</Text>
                  <QuantitySet
                    containerStyle={{marginTop:-5, marginLeft:2}}
                    textStyle={{fontSize:16,minWidth:0,marginLeft:2,marginRight:2}}
                    controllerStyle={{fontSize:22}}
                    value={product.quantity}
                    min={1}
                    update={(qty)=>this.cartUpdate(product, qty,i)}>
                  </QuantitySet>
                </View>
                
                <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'flex-end'}}>
                  <Text style={{fontSize:16, fontWeight:'400', color:global.styles.textLight3,marginRight:3}}>{I18n.t('Subtotal')}</Text> 
                  <RenderPrice
                    uFontSize={12}
                    fontSize={16}
                    oldPriceTxt={{flex:1, alignSelf:'flex-end', alignItems:'flex-end', justifyContent:'flex-end'}}
                    price={product.total.price * product.quantity}
                    sprice={product.total.sprice  * product.quantity}
                    from={product.total.from}
                    to={product.total.to}
                    dateNow={this.dateNow}
                  />
                </View>
              </View>
            </View>
            </View>
          </TouchableOpacity>
        );
      });
    else
      return(
        <View>
          <Text style={{fontSize:18,color:'#333'}}>{I18n.t("No Any Record")}</Text>
        </View>
      )
  }


  renderProductOptions(Options){
    return Object.values(Options).map((option, i) => {
      let isColor = option.code.toLowerCase().indexOf("color") > -1;
      return(
        <View key={i} style={{marginLeft:10, marginTop:5, paddingBottom:10, borderBottomColor:global.styles.textLight3, borderBottomWidth:0.5, borderStyle:'dotted'}}>
          {
            isColor
            ?
            <View
              style={{
                width:50, 
                height:50,
                borderColor:'#2326', 
                borderWidth:0.7,
                padding:4,
                borderRadius:10
              }}>
              <ColorView style={{width:41, height:41}} colorId={option.values[0].value_index} />
            </View>
            :
            <View>
              <Text style={{fontSize:16, color:global.styles.text1}}>{option.label}</Text>
              <View style={{flexDirection:'row'}}>
                {this.renderProductOptionValue(option.values, option.attribute_id, i)}
              </View>
            </View>
          }
        </View>
      );
    });
  }

  renderProductOptionValue(values, parentId, index){
    // let options = Options;
    // if(key=="simOption"){
    //   options = [];
    //   Options.forEach(option => {
    //     if(option.key=="Day"){
    //       options[0] = {name:option.name, value:option.value}
    //     }else if(option.key=="Data"){
    //       options[1] = {name:option.name, value:option.value}
    //     }else if(option.key=="Day-unit"){
    //       options[0]['unit']=option.name
    //     }else if(option.key=="Data-unit"){
    //       options[1]['unit']=option.name
    //     }
    //   });
      
    // }

    return Object.values(values).map((value, i) => {
      // if(value.value_index == this.props.configurable_item_options[parentId])
        return(
          <View key={i} style={{marginLeft:4, flexDirection:'row', marginRight:10}}>
            {/* <Text style={{fontSize:17, color:global.styles.text1}}>* {option.name} </Text>
            <Text style={{fontSize:17, color:global.styles.text1}}>{option.value} {option.unit||''}</Text> */}
            <Text style={{fontSize:17, color:global.styles.text1}}>{value.label}</Text>
          </View>
        );
    });
  }

  render() { 
    return (
      <Container style={styles.container}>
      <Statusbar backgroundColor={global.colors.background.statusBar}/>
        <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader 
            title={I18n.t('Shopping Cart')}
            titleColor={global.colors.text.statusBar}
          />
        </View>
        <Loading ref="Loading" />
        <Content>
        <View style={{
            flex:1,
            margin:6,  
            marginTop:10,
            borderRadius:15,
            alignItems:'center',
            overflow:'hidden',
            // backgroundColor:global.styles.bodyLight
            }}>
            {this.render_product()}
          </View>
        </Content>
        {
          this.state.total.sprice > 0?
            <View style={{
              flexDirection:'row',
              height:65,
              marginTop:0,
              alignItems:'center',
              backgroundColor:global.styles.bodyLight,
              borderTopWidth:0.7,
              borderTopColor:'#ddd'
              }}>
              <View style={{flex:1, alignItems:'flex-end', marginRight:5}}>
                <Text style={{fontSize:20, fontWeight:'bold', color:global.styles.textLight2}}>{I18n.t('Total')}</Text>
              </View>
              <RenderPrice
                uFontSize={16}
                fontSize={22}
                oldPriceTxt={{alignSelf:'flex-end', alignItems:'flex-end', justifyContent:'flex-end'}}
                price={this.state.total.price}
                sprice={this.state.total.sprice}
                from={null}
                to={null}
                dateNow={null}
              />
              <TouchableOpacity 
                onPress={()=>this.submitOrder()}
                style={{backgroundColor:global.styles.btn, margin:8, borderRadius:20, padding:3, alignItems:'center', justifyContent:'center'}}>
                <View style={{flex:1, alignItems:'center', justifyContent:'center', }}>
                  <Text style={{ fontSize:16, fontWeight:'bold', marginLeft:15, marginRight:15, color:global.styles.text1 }}>{I18n.t('Settle')}</Text>
                </View>
              </TouchableOpacity>
            </View> 
          :
            null
        }
      <SafeAreaView style={{backgroundColor:global.styles.bodyLight}} />
      </Container>
    );
  }
}
 
const mapStateToProps = ({ user, shoppingCart }) => ({ user, shoppingCart, });
export default connect(mapStateToProps,{ fetchData, CartCheck, updateCartPrductQty, removeFromCart, updateProductImage, orderCartList })(ShoppingCart);
