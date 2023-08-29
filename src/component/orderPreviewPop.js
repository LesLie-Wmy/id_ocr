//import libraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image as RNImage,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Button
} from 'native-base'
import { connect } from 'react-redux';
import I18n from '../langs'
import { fetchData } from '../actions/fetch';
import { Actions, ActionConst } from 'react-native-router-flux';
import Image from "./ResponsiveImage";
import { addCart } from '../actions/shoppingCart';
import Loading from './loading';

// import ntpClient from 'react-native-ntp-client';

import OptionsSet from './OptionsSet';
import RenderPrice from './RenderPrice';
import SelectBox from './SelectBox';
import ImageRP from "./ResponsiveImage";
var moment = require('moment');

// create a component
class OrderPreviewPop extends Component {
  constructor(props){
    super(props);
    // let data = this.props.configurableList[0];
    

    // let selects = "";
    // for(var select of Object.keys(this.state.selectList)){
    //   selects += "item.custom_attributes['"+ select +"'] == "+ this.state.selectList[select] +" &&";
    // }
    // // console.log("selects:"+JSON.stringify(selects));
    // let image = this.state.image;
    // let data = this.props.configurableList.filter((item) => eval(selects.substring(0, selects.length - 3)) )
    //     .map(_data => { 
    //       for(var k of Object.keys(this.props.configurableKeys)){
    //         allowedList[_data.custom_attributes[k]] = null;
    //         global.image = _data.custom_attributes.thumbnail;
    //         this.props.configurableList.filter((item) => item.custom_attributes[k] == _data.custom_attributes[k] )
    //         .map(_data2 => {
    //           for(var k2 of Object.keys(this.props.configurableKeys)){
    //             allowedList[_data2.custom_attributes[k2]] = null;
    //           }
    //         })
    //       }
    //       return _data;
    //     });


    let selectList = {};
    let selects = "";
    for(let k of Object.keys(props.configurable_item_options)){
      if(props.configurable_item_options[k]){
        selectList[props.options[k].code] = props.configurable_item_options[k];
        selects += "item.custom_attributes['"+ props.options[k].code +"'] == "+ props.configurable_item_options[k] +" &&";
        allowedList.push(""+props.configurable_item_options[k]);
      }
    };

    let data = this.props.configurableList.filter((item) => eval(selects.substring(0, selects.length - 3)) )
      .map(_data => { 
        for(var k of Object.keys(this.props.configurableKeys)){
          this.props.configurableList.filter((item) => item.custom_attributes[k] == _data.custom_attributes[k] )
        }
        return _data;
      });
  
    console.log("'price' of undefined", data);
    if(data.length==0)
      data = this.props.configurableList;
    this.state={
      qty : 1,
      fetching:true,
      configurable_item_options:props.configurable_item_options?props.configurable_item_options:{},
      allowedList:global.allowedList,
      selectList:selectList,
      price:data[0].price,
      image:global.image,
      sprice:data[0].custom_attributes.special_price,
      from:data[0].custom_attributes.special_from_date,
      to:data[0].custom_attributes.special_to_date,
      requiredMissList:[],
      selectedConfigurableItem:data[0]
    }
  }

  componentDidMount(){
    // this.refs.Loading.show();
    // this.fetchMineCart();

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

    this.checkCard();

    // ntpClient.getNetworkTime("pool.ntp.org", 123, (error, date) => {
    //   if (error) {
    //       console.error(error);
    //       return;
    //   }else{
    //     console.log(date); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
    //     global.dateNow = moment(date).valueOf();
    //   }
    // });
  }

  checkCard(){
    if(typeof(this.props.shoppingCart.id) != 'number' ){
      this.fetchMineCart(false);
    }
  }

  fetchMineCart(isAddCart){
    this.refs.Loading.show();
    let lang = I18n.currentLocale();
    if(this.props.user.user && this.props.user.user.token && this.props.user.user.tokenExpired){
      this.props.fetchData({
        start:'FETCHING_MINE_CART_START',
        next:'FETCHING_MINE_CART_SUCCESS',
        rejected:'FETCHING_MINE_CART_ERROR',
        method:'POST',
        // url:'store/block/21',
        url:'carts/mine',
        data:{
          'lang':lang,
          'token':this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired
        },
        callback:(data, isError) => this.getCartBack(data, isError, isAddCart)
      })
    }
  }

  getCartBack(data, isError, isAddCart){
    this.refs.Loading.hide();
    if(isError){
      if(data.message){
        setTimeout(() => {
          Alert.alert('',
          I18n.t(data.message, {defaultValue: data.message}),
          [
            {text: I18n.t('BACK'), onPress: () => Actions.pop()}
          ],
          { cancelable: false })
        }, 200);
      }else{
        setTimeout(() => {
          Alert.alert('',
          I18n.t('Get cart failed Please try again'),
          [
            {text: I18n.t('BACK'), onPress: () => this.pop()}
          ],
          { cancelable: false })
        }, 200);
      }
    }else{
      if(isAddCart)
        this.addCart();
    }
  }

  payNow(){
    // if(Object.keys(this.props.address).length<1 &&  this.props.shipping){
    //   Alert.alert('',
    //     I18n.t('Please go to set your shipping address'),
    //     [
    //       {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
    //       {text: I18n.t('Yes'), onPress: () => this.props.onAddressChange()}
    //     ],
    //     { cancelable: false })
    // }
    if(this.checkRequired()){
      Actions.pop({ refresh: {orderPreviewBack:true}, timeout: 1});
      setTimeout(() => {
        Actions.PaymentPreview({...this.props, quantity:this.state.qty, selectedConfigurableItem:this.state.selectedConfigurableItem, express:true});
      }, 100);
    }
  }

  sendGift(){
    if(this.checkRequired()){
      Actions.pop({ refresh: {orderPreviewBack:true}, timeout: 1});
      setTimeout(() => {
        Actions.PaymentPreview({...this.props, quantity:this.state.qty, selectedConfigurableItem:this.state.selectedConfigurableItem, express:true});
      }, 100);
    }
  }

  addCart(){
    if(this.checkRequired()){
      this.refs.Loading.show();

      // quantity = 1;
      // if(this.props.quantity){
      //   quantity = this.props.quantity;
      // }
      
      // row = {
      //   product_id:this.props.product_id,
      //   sku:this.props.sku,
      //   image:this.props.image,
      //   options:this.props.options,
      //   selectedConfigurableItem:this.state.selectedConfigurableItem,
      //   pname:this.props.pname,
      //   total:this.props.total,
      //   quantity:this.state.qty,
      //   model:this.props.model,
      // }
      let configurable = [];
      Object.keys(this.state.configurable_item_options).forEach(val => {
        configurable.push({
          "option_id":val,
          "option_value":this.state.configurable_item_options[val]
        })
      })
      this.props.fetchData({
        start:'FETCH_PRODUCT_ADD_CART_START',
        next:'FETCH_PRODUCT_ADD_CART_SUCCESS', 
        rejected:'FETCH_PRODUCT_ADD_CART_ERROR', 
        method:'POST',
        url:'carts/add/',
        data:{
          "lang":I18n.currentLocale(),
          "sku":this.state.selectedConfigurableItem.sku,
          "qty":this.state.qty,
          "quote_id":this.props.shoppingCart.id,
          "configurable":configurable,
          "token":this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired
        },
        callback:(data, isError)=>this.cartAdded(data, isError)
      });

      
    }
    // setTimeout(() => {
    // }, 100);
  }

  cartAdded(data, isError){
    this.refs.Loading.hide();
    if(!isError){
      this.props.addCart({...this.props, sku:this.state.selectedConfigurableItem.sku, item_id:data.data.item_id, quantity:this.state.qty, selectedConfigurableItem:this.state.selectedConfigurableItem});
      Actions.pop({ refresh: {orderPreviewBack:true}, timeout: 1});
    }else{
      if(data.message){
        setTimeout(() => {
          Alert.alert('',
          I18n.t(data.message, {defaultValue: data.message}),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
            {text: I18n.t('RETRY'), onPress: () => this.fetchMineCart(true)}
          ],
          { cancelable: false })
        }, 100);
      }else{
        setTimeout(() => {
          Alert.alert('',
          I18n.t('Add item to cart failed Please try again'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
            {text: I18n.t('RETRY'), onPress: () => this.fetchMineCart(true)}
          ],
          { cancelable: false })
        }, 100);
      }
    }
  }

  checkRequired(){
    
    if(this.state.selectedConfigurableItem.type_id == "simplan" && this.props.user.user.custom_attributes.iccid == undefined){
      setTimeout(() => {
        Alert.alert(
          '',
          I18n.t('No sim card in your account To add it now'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log("Cancel bind sim card")},
            {text: I18n.t('Goto'), onPress: () => Actions.ScanSim({ type: ActionConst.REPLACE, GoHome:true })}
          ],
          { cancelable: false }
        )
      }, 100);

      return false;
    }

    let requiredMissList = [];
    for(var key of Object.keys(this.state.configurable_item_options)){
      if(this.state.configurable_item_options[key] == null){
        requiredMissList.push(key);
      }
    }

    console.log(requiredMissList);

    if(requiredMissList.length>0){
      this.setState({
        requiredMissList:requiredMissList
      });
      return false
    }else{
      return true
    }
  }

  render() {
    // let quantity = this.props.quantity?this.props.quantity:1;
    return (
      <Modal transparent animationType="slide" style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end',}}>
        <View style={{flex:1, backgroundColor:'#00000066'}}>
        <View style={{flex:1}}>
          <Loading style={{backgroundColor:global.colors.background.statusBar}} ref="Loading" isShow={false} text={''} />
          </View>
          <View style={styles.container}>
            <View style={{flexDirection:'row', borderRadius:20, marginTop:10, width:'100%'}}>
              <View style={{backgroundColor:'#fff', marginLeft:10, marginTop:10}}>
                <ImageRP 
                    source={global.storeMediaURL + 'catalog/product' + global.image} 
                    style={{ borderTopLeftRadius:5, borderTopRightRadius:5, width:120, height:120}}
                  />
              </View>
              <View style={{flex:1,marginLeft:5, marginRight:10, marginTop:5}}>
                <View 
                  style={{marginBottom:2, marginRight:10, alignItems:'flex-start', justifyContent:'flex-end'}}
                  >
                  <RenderPrice
                    uFontSize={15 * global.scale}
                    fontSize={20 * global.scale}
                    style={{alignItems:'flex-start', justifyContent:'flex-start', marginTop:-10, marginBottom:-5 }}
                    oldPriceTxt={{alignSelf:'flex-start'}}
                    price={this.state.price}
                    sprice={this.state.sprice}
                    from={this.state.from}
                    to={this.state.to}
                    dateNow={global.dateNow}
                  />
                </View>
                <Text numberOfLines={4} style={{fontSize:16 * global.scale, fontWeight:'bold', color:global.styles.text1}}>{this.props.pname}</Text>
              </View>
              <TouchableOpacity 
                style={{
                  position:'absolute',
                  top:-5,
                  right:0
                }}
                onPress={()=>{
                  this.props.updateOnPay(false);
                  Actions.pop({type:ActionConst.REFRESH});
                }}>
                <Icon type='AntDesign' name='close' style={{fontSize:30 * global.scale, color:global.colors.text.d3, marginRight:5}} />
              </TouchableOpacity>
            </View>
            <View style={{flex:1,width:'100%', height:'100%'}}>
              {/** Product Price Options */}
              <View style={{flexDirection:'column', marginTop:5, width:'100%'}}>
                {/* <Text style={{color:global.colors.text.d1, fontSize:20 * global.scale,}}>{I18n.t('Subtotal')}: </Text>
                {this.props.total.points>0?<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <RNImage source={require('../images/icon_point_max.png')} style={{width:26*0.9, height:23*0.9, marginRight:-5, marginTop:2}} />
                  <Text style={{fontSize:24 * global.scale, color:global.styles.priceTxt, fontWeight:'bold'}}> {global.NumberFormat(this.props.total.spoints?this.props.total.spoints * quantity:this.props.total.points * quantity)}</Text>
                </View>:null}
                {this.props.total.points>0 && this.props.total.price>0?<View><Icon type='AntDesign' name='plus' style={{fontSize: 22 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:-4, marginTop:-4, marginLeft:5  }}/></View>:null}
                {this.props.total.price>0?<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:24 * global.scale, color:global.styles.priceTxt, fontWeight:'bold', marginLeft:2, marginRight:-5}}>HK$</Text>
                  <Text style={{fontSize:24 * global.scale, color:global.styles.priceTxt, fontWeight:'bold'}}> {global.NumberFormat(parseFloat(this.props.total.sprice?this.props.total.sprice * quantity:this.props.total.price * quantity).toFixed(2))}</Text>
                </View>:null} */}
                
                <View style={{flexDirection:'row', marginTop:5, marginLeft:10, alignItems:'center', justifyContent:'flex-end'}}>
                  <Text 
                    style={{
                      color:global.colors.text.d1,
                      fontSize:19 * global.scale,
                      marginRight:5
                    }}>{I18n.t('Quantity')}</Text>
                  <OptionsSet
                    data={[]}
                    index={0}
                    type='Quantity'
                    max={99}
                    containerStyle={{
                      justifyContent:'center',
                      alignItems:'center',
                      minWidth:70,
                      borderColor:'#ccc',
                      borderWidth:1,
                      borderRadius:10,
                      marginRight:10
                      }}
                    textNumberStyle={{minWidth:30, textAlign:'center', borderColor:'#ccc', borderRightWidth:0, borderLeftWidth:0,marginLeft:1, marginRight:1, marginTop:1}}
                    textStyle={{color:global.styles.textLight1, fontSize:19 * global.scale}}
                    update={(qty)=>this.state.qty = qty}
                    renderMinus={
                        <View style={{margin:0.2, padding:1, paddingLeft:1, paddingRight:1,justifyContent:'center', alignItems:'center'}}>
                          <Text style={{fontSize:20 * global.scale}}>-</Text>
                        </View>
                      }
                    renderPlus={
                        <View style={{margin:0.2, padding:1, paddingLeft:1, paddingRight:1,justifyContent:'center', alignItems:'center'}}>
                          <Text style={{fontSize:20  * global.scale }}>+</Text>
                        </View>
                      }
                  />
                </View>
                
                  {/* <Text style={{fontSize:22* global.scale}}>{this.attribute['Day-unit']}</Text> */}
                
              </View>
              {/** End Product Price Options */}


              {/** Product Options */}
              <ScrollView 
                bounces = {false}
                style={{flex:1}}>
                  {/** Render Sim Attributes */}
                    {
                      this.props.configurableList[0].type_id == "simplan"?
                      this.renderSimAttributes(this.props.configurableList[0].custom_attributes)
                      :null
                    }
                  {/** End Render Sim Attributes */}
                  {this.renderProductOptions(this.props.options)}
              </ScrollView>
              {/** End Product Options */}
              {
                this.props.gift?
                <View style={{flexDirection:'row', width:'80%', marginTop:10, alignSelf:'center', alignItems:'center', justifyContent:'center', borderBottomColor:'#B0C5FC', borderBottomWidth:1}}>
                  <Icon type='Octicons' name="gift" style={{fontSize: 32 * global.scale, color: global.styles.ruby}}/>  
                  <Text style={{fontSize:22 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale, marginTop:5 * global.scale, marginBottom:5 * global.scale}}> {this.props.gift.nickname}</Text>
                  <Text style={{fontSize:22 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}>({this.props.gift.phone})</Text>
                </View>:null
              }
              {/* 
                Points
               <View style={{flexDirection:'row', width:'80%', alignSelf:'center', alignItems:'center', justifyContent:'center', borderBottomColor:'#B0C5FC', borderBottomWidth:1}}>
                <Text style={{fontSize:24 * global.scale, color:global.styles.textLight1}}>{I18n.t('Your Balance')}</Text>
                <RNImage source={require('../images/icon_point_max.png')} style={{width:26*0.9, height:23*0.9, marginRight:-5, marginTop:2, marginLeft:5}} />
                <Text style={{fontSize:24 * global.scale, color:global.styles.textLight1, marginLeft:5}}>{global.NumberFormat(this.props.balance)}</Text>
              </View>
               */}

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
              <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                {/* <Button 
                  onPress={()=>this.sendGift()}
                  style={{flex:1, marginTop:10 * global.scale, marginBottom:10 * global.scale, marginLeft:10 * global.scale, alignSelf:'center', alignItems:'center', justifyContent:'center', backgroundColor:global.styles.btn, paddingLeft:20 * global.scale, paddingRight:20 * global.scale}}>
                  <Icon type='MaterialCommunityIcons' name="cube-send" style={{fontSize: 22 * global.scale, color: global.colors.text.t1,marginLeft:0, marginRight:0}}/>
                  <Text style={{fontSize:18 * global.scale, color:global.colors.text.t1, }}>
                  {I18n.t('Send Gift')}
                  </Text>
                </Button> */}
                <Button 
                  onPress={()=>this.addCart()}
                  style={{flex:1, marginTop:10 * global.scale, marginBottom:10 * global.scale, marginLeft:10 * global.scale, marginRight:10 * global.scale, alignSelf:'center', alignItems:'center', justifyContent:'center', backgroundColor:global.styles.btn, paddingLeft:20 * global.scale, paddingRight:20 * global.scale}}>
                  <Icon type='MaterialCommunityIcons' name="cart-plus" style={{fontSize: 22 * global.scale, color: global.colors.text.t1,marginLeft:0, marginRight:0}}/>
                  <Text style={{fontSize:18 * global.scale, color:global.colors.text.t1, }}>
                    {I18n.t('ADD CART')}
                  </Text>
                </Button>
                {/* <Button 
                  onPress={()=>this.payNow()}
                  style={{marginTop:10 * global.scale, marginBottom:10 * global.scale, marginLeft:10 * global.scale, alignSelf:'center', alignItems:'center', justifyContent:'center', backgroundColor:global.styles.btn, paddingLeft:20 * global.scale, paddingRight:20 * global.scale}}>
                  <View style={{flexDirection:'row',}}>
                  <Icon type='MaterialCommunityIcons' name="cash-usd" style={{fontSize: 22 * global.scale, color: global.colors.text.t1, marginLeft:0, marginRight:0}}/>
                  <Text style={{fontSize:18 * global.scale, color:global.colors.text.t1, }}>{I18n.t('BUY')}</Text>
                  </View>
                </Button> */}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderSimAttributes(attributes){
    let simAttributes = [];
    global.simAttributes.map((attr, index) =>{
      if(attributes[attr]){
        simAttributes.push(
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:18, marginBottom:5, marginRight:10}}>{I18n.t(attr)}:</Text>
            <Text style={{fontSize:18, marginBottom:5, marginRight:10}}>{attributes[attr]}</Text>
          </View>
        )
      }
    })
    return (
      <View style={{margin:10}}>{simAttributes}</View>
    )
  }

  renderQuantity(quantity){
    if(quantity){
      return(
        <View style={{flexDirection:'row', marginLeft:10, marginTop:5, paddingBottom:10, borderBottomColor:global.styles.textLight3, borderBottomWidth:0.7}}>
          <Text style={{fontSize:19, color:global.styles.text1}}>{I18n.t('Quantity')}</Text>
          <View style={{flexDirection:'row'}}>
            <View style={{marginLeft:4, flexDirection:'row', marginRight:10}}>
              <Text style={{fontSize:17, color:global.styles.text1}}> x {quantity} </Text>
            </View>
          </View>
        </View>
      );
    }
  }

  renderProductOptions(Options){
    return Object.values(Options).map((option, i) => {
      return(
        <View key={i} style={{marginLeft:10, marginTop:5, paddingBottom:10, borderBottomColor:global.styles.textLight3, borderBottomWidth:0.7}}>
          <Text style={{fontSize:19, color:global.styles.text1}}>{option.code.toLowerCase().indexOf("color") > -1 ?"":option.label}</Text>
          <View style={{flexDirection:'row'}}>
            {this.renderProductOptionValue(option.attribute_id, option.values, option.type, option.code)}
          </View>
        </View>
      );
    });
  }

  renderProductOptionValue(id, options, type, code){
    if(type=="simOption"){
      options = [];
      Options.forEach(option => {
        if(option.key=="Day"){
          options[0] = {name:option.name, value:option.value}
        }else if(option.key=="Data"){
          options[1] = {name:option.name, value:option.value}
        }else if(option.key=="Day-unit"){
          options[0]['unit']=option.name
        }else if(option.key=="Data-unit"){
          options[1]['unit']=option.name
        }
      });
      
    }else if(type=="select"){
      return(
        <SelectBox 
          id={id}
          code={code}
          options={options}
          default={this.props.configurable_item_options[id]}
          requiredMissList={this.state.requiredMissList}
          allowedList={this.state.allowedList}
          onChange={(val) => this.updateOptionValue(val)}
         />
      )
    }else{
      return options.map((option, i) => {
        return(
          <View key={i} style={{marginLeft:4, flexDirection:'row', marginRight:10}}>
            <Text style={{fontSize:17, color:global.styles.text1}}>* {option.name} </Text>
            <Text style={{fontSize:17, color:global.styles.text1}}>{option.value} {option.unit||''}</Text>
          </View>
        );
      });
    }
  }

  updateOptionValue(val){
    // console.log(val);
    if(val.index < 0){
      let selectList = this.state.selectList;
      delete selectList[val.code];
      this.state.selectList = selectList;
      this.state.configurable_item_options[val.option_id] = null;
    }else{
      this.state.selectList[val.code] = val.value_index;

      this.state.configurable_item_options[val.option_id] = val.value_index;
    }
    

    let allowedList = {};
    let selects = "";
    for(var select of Object.keys(this.state.selectList)){
      selects += "item.custom_attributes['"+ select +"'] == "+ this.state.selectList[select] +" &&";
    }
    // console.log("selects:"+JSON.stringify(selects));
    let image = this.state.image;
    let data = this.props.configurableList.filter((item) => eval(selects.substring(0, selects.length - 3)) )
        .map(_data => { 
          for(var k of Object.keys(this.props.configurableKeys)){
            allowedList[_data.custom_attributes[k]] = null;
            global.image = _data.custom_attributes.thumbnail;
            this.props.configurableList.filter((item) => item.custom_attributes[k] == _data.custom_attributes[k] )
            .map(_data2 => {
              for(var k2 of Object.keys(this.props.configurableKeys)){
                allowedList[_data2.custom_attributes[k2]] = null;
              }
            })
          }
          return _data;
        });
    allowedList = Object.keys(allowedList);
    // console.log("data:"+data, "allowedList:"+JSON.stringify(allowedList), "selects:"+JSON.stringify(selects));
    let itemFirst;
    if(data.length > 0){
      itemFirst = data[0];
    }else{
      itemFirst = this.props.configurableList[0]
    }
    
    if(this.props.updateConfigurableOptions){
      this.props.updateConfigurableOptions(this.state.configurable_item_options);
    }

    global.allowedList = allowedList;
    this.setState({
      price:itemFirst.price,
      sprice:itemFirst.custom_attributes.special_price,
      from:itemFirst.custom_attributes.special_from_date,
      to:itemFirst.custom_attributes.special_to_date,
      allowedList:allowedList,
      selectedConfigurableItem:itemFirst,
      requiredMissList:[]
    });
  }


}

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex:1,
    height: '70%',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: global.styles.bodyLight,
    // borderTopColor: global.styles.textLight3,
    // borderTopWidth:2,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    overflow:'hidden'
  },
});

//make this component available to the app
const mapStateToProps = ({ user, shoppingCart }) => ({ user, shoppingCart });
export default connect(mapStateToProps, { fetchData, addCart })(OrderPreviewPop);

// setInterval(() => {
//   if(window.location.href == "https://www.watsons.com.hk/main/Site-Maintenance.html"){
//     window.location.href = "https://www.watsons.com.hk/product-watsons/watsons-hygienic-face-mask/p/BP_228276";
//   }
// }, 1000);
