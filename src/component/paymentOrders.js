import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  NativeAppEventEmitter,
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
  Footer,
  FooterTab
} from 'native-base'
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';
import RNPaypal from 'react-native-paypal-lib';
import Alipay from 'rn-alipay';
import ImageRP from "./ResponsiveImage";

import I18n from '../langs';
import Statusbar from './Statusbar';
import MyHeader from './MyHeader';
import PaymentMethod from './paymentMethod';
import Loading from './loading';
import ColorView from './ColorView';

import RenderPrice from './RenderPrice';

import { fetchingData } from '../actions/fetch';

var dateFormat = require('dateformat');
var moment = require('moment');
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.styles.body
  }
});
 
class PaymentOrders extends Component {
  constructor(props){
    super(props);
    console.log(props);
    let row = null;
    if(props.express){
      let total = {}
      // total['totalPrice']=props.total.sprice?props.total.sprice:props.total.price;
      // total['totalPoints']=props.total.spoints?props.total.spoints:props.total.points;
      total['price']=props.selectedConfigurableItem.price;
      total['sprice']=props.selectedConfigurableItem.custom_attributes.special_price;
      total['from']=props.selectedConfigurableItem.custom_attributes.special_from_date;
      total['to']=props.selectedConfigurableItem.custom_attributes.special_to_date;

      let options = JSON.parse(JSON.stringify(props.options));
      
      for(var k of Object.keys(props.options)){
        optionValues = []
        props.options[k].values.forEach(value => {
          if(value.value_index == this.props.configurable_item_options[k])
            optionValues.push(value);
        });
        options[k].values = optionValues;
      }
      
      row = [{
        product_id:props.product_id,
        sku:props.sku,
        image:props.selectedConfigurableItem.custom_attributes.thumbnail,
        options:options,
        pname:props.pname,
        total:total,
        quantity:props.quantity,
        model:props.model,
      }]
    }else{
      row=this.props.row;
    }
    this.state={
      // ...props,
      total:props.total,
      address:this.props.user.user.default_shipping?this.props.user.user.addresses.find(a => a.id == this.props.user.user.default_shipping):{},
      paymentMethod:undefined,
      products:row,
    }
  }

  componentDidMount(){
    this.listener = NativeAppEventEmitter.addListener('alipay.mobile.securitypay.pay.onPaymentResult', (msg) => this._onAlipayPaymentResult(msg) /* this._nativeTester(msg) */) //alipay
  }

  componentWillReceiveProps(props){
    console.log(props);
    if(props.onChangeAddressBack){
      // this.address=props.address?props.address:this.address;
      this.setState({
        address:props.address?props.address:this.state.address
      })
    }
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

  paySubmit(){
    if(Object.keys(this.state.address).length==0){
      Alert.alert('',
        I18n.t('Please set your shipping address'),
        [
          {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed')},
          {text: I18n.t('Yes'), onPress: () => Actions.AddressBook({onPayment:true, address:this.state.address})}
        ],
        { cancelable: false })
    // }else if(!this.state.paymentMethod && this.state.total.totalPrice>0){
    //   Alert.alert('',
    //     I18n.t('Please set your payment method'),
    //     [
    //       {text: I18n.t('Yes'), onPress: () => console.log('OK')}
    //     ],
    //     { cancelable: false })
    }else{
      this.Loading.show();
      this.props.fetchData({
        next:'FETCH_PAY_SUBMIT_SUCCESS', 
        rejected:'FETCH_PAY_SUBMIT_ERROR', 
        method:'POST',
        url:'orders/init', 
        data:{
          'token':this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired,
          'address':this.state.address,
          "lang":I18n.currentLocale(),
        },
        callback:(data, isError)=>{
          if(isError){
            this.Loading.hide();
            if(data.message=='error_over_qty'){
              setTimeout(() => {
                Alert.alert(I18n.t(data.message, {defaultValue: data.message}), I18n.t('Product %{name} Inventory Shortage', {name:data.data.name}));
              }, 200);
            }else{
              setTimeout(() => {
                Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
              }, 200);
            }
          }else{

            // if(this.state.paymentMethod){
            
            this.total = data.total;
            this.order_id = data.order_id;
            this.total_point = data.total_point;
            this.pay();
            // }else{
            //   this.updateOrderStatus(data.order_id);
            // }
            
            // this.state.address_id = data.data;
            // this.props.AddressAdd(this.state, this.index);
          }
        }
      });
    }
    
  }

  updateOrderStatus(id){
    this.props.fetchingData({
      next:'UPDATE_STATUS_SUCCESS', 
      rejected:'UPDATE_STATUS_ERROR', 
      method:'POST',
      url:'order.php', 
      data:{
        "email":this.props.user.user.email,
        "password":this.props.user.user.password,
        "id":id,
        "lang":I18n.currentLocale(),
        "action":"updateStatus"
      },
      callback:(data, isError)=>{
        this.Loading.hide();
        if(isError){
          if(data.message=='error_over_qty'){
            setTimeout(() => {
              Alert.alert(I18n.t(data.message, {defaultValue: data.message}), I18n.t('Product %{name} Inventory Shortage', {name:data.data.name}));
            }, 200);
          }else if(data.message=='error_minimum'){
            setTimeout(() => {
              Alert.alert(I18n.t(data.message, {defaultValue: data.message}), I18n.t('The Quantity of %{name} must more than %{minimum}', {name:data.data.name, minimum:data.data.minimum}));
            }, 200);
          }else{
            setTimeout(() => {
              Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
            }, 200);
          }
        }else{
          setTimeout(() => {
            Alert.alert('',
              I18n.t('Success'),
              [
                {text: I18n.t('Yes'), onPress: () => this.back()}
              ],
              { cancelable: false }
            )}, 200
          );
          // this.state.address_id = data.data;
          // this.props.AddressAdd(this.state, this.index);
        }
      }
    });
  }

  pay(){
    if(this.state.paymentMethod=="paypal"){
      RNPaypal.paymentRequest({
          clientId: 'AYXagHCSL408dM11GCaQOYRqCjr1PgdbJc1K1D4TR_fCV2yQFw0HPGauDgSzg86kOaoDVi6gAk8Zg0DW',
          environment: RNPaypal.ENVIRONMENT.SANDBOX,
          intent: RNPaypal.INTENT.SALE,
          price: this.total,
          currency: 'HKD',
          description: `Pay for eFun Sim And Order ID is E000219`+ this.order_id,
          acceptCreditCards: true
      }).then(response => {
        this.updateOrderStatus(this.order_id);
      }).catch(err => {
        
        this.Loading.hide();
          console.log(err.message)
          setTimeout(() => {
            Alert.alert('',
              err.message,
              [
                {text: I18n.t('OK'), onPress: () => console.log(err.message)}
              ],
              { cancelable: false }
            )
          }, 200);;
      })
    }else if(this.state.paymentMethod=="alipay") {
      let date = new Date();
      const data = {
          outTradeNO: dateFormat(date, 'yyyymmddhhMMss') +"-"+ this.order_id, //订单ID（由商家自行制定）
          subject: 'eFun Sim', //商品标题
          body: `Pay for eFun Sim And Order ID is E000219`+ this.order_id, //商品描述
          totalFee: this.total.toString(), //商品价格
          notifyURL : 'http://www.efunsim.com/hksim/hkwSimBackend/alipayNotify.php',
      };
    
      Alipay.pay(data);
    }
  }

  _addtransaction(order_id,transaction_id,payment_method,date){
    this.props.fetchingData({
      next:'FETCH_ADD_TRANSACTION_SUCCESS', 
      rejected:'FETCH_ADD_TRANSACTION_ERROR', 
      method:'POST',
      url:'order.php', 
      data:{
        "email":this.props.user.user.email,
        "password":this.props.user.user.password,
        "lang":I18n.currentLocale(),
        "action":"addtransaction",
        "order_id":this.order_id,
        "transaction_id":transaction_id,
        "payment_method":payment_method,
        "date":date
      }
      // callback:this._endPayment.bind(this)
    });
  }

  _confirmPaid(){
    setTimeout(() => {
      Alert.alert(
        I18n.t("Processing payment"),
        I18n.t('PROCESSING_PAYMENT_MSG'),
        [
            {text: 'OK', onPress: () => [this.listener.remove(),this._goBack()]},
        ],
        { cancelable: true })
    }, 200);
  }

  orderAddAlipaySign(sign, outTradeNO){
    this.props.fetchingData({
      next:'FETCH_alipayAddRecord_SUCCESS', 
      rejected:'FETCH_alipayAddRecord_ERROR',  
      method:'POST', 
      url:'order.php', 
      data:{
        "email":this.props.user.user.email,
        "password":this.props.user.user.password,
        "order_id":this.order_id,
        "lang":I18n.currentLocale(),
        "action":"alipayAddRecord",
        "sign":sign,
        "outTradeNO":outTradeNO
      }
    });
  }

  _onAlipayPaymentResult(msg){
    if(typeof(msg) === 'object'){
      // console.log(`result.resultStatus = ${msg.resultStatus}`)
      // console.log(`result.memo = ${msg.memo}`)
      // console.log(`result.result = ${msg.result}`)
      if(msg){
        if(msg.resultStatus == "9000"){
          if( typeof msg.result != "object"){
            let kk = "{\"" + msg.result.substring(0, decodeURI(msg.result).indexOf("&sign=")) + "}";
            msg.result = JSON.parse(kk.replace(/&/g, ',"').replace(/=/g,'":').replace(/"{/g,'{').replace(/}"/g,'}'));
          }
          var d = new Date();
          confirm = {
              client:{product_name:msg.result.payment_inst},
              response:{
                  id:msg.result.out_trade_no,
                  create_time:d.getTime(),
                  state:'approved'
              }
          }

          this._addtransaction(this.order_id, msg.result.out_trade_no, "Alipay", d.toISOString());
          this.updateOrderStatus(this.order_id);
          this.listener.remove();
          // this.updateOrderComments();

        }else if(msg.resultStatus == "8000"){
            setTimeout(() => {
                Alert.alert(
                    I18n.t("Processing payment"),
                    I18n.t('Is payment completed?'),
                    [
                        {text: I18n.t('Already paid'), onPress: () => this._confirmPaid()},
                        {text: I18n.t('Repay'), onPress: () => this.pay()},
                        {text: I18n.t('Cancel'), onPress: () => this.back()},
                    ],
                    { cancelable: true })
            }, 200);
        }else if(msg.resultStatus == "6001"){
            setTimeout(() => {
                Alert.alert(
                  I18n.t("Unprocessed payment"),
                  [
                    {text: I18n.t('Repay'), onPress: () => this.pay()},
                    {text: I18n.t('Cancel'), onPress: () => /* this.cancelOrder() */ console.log("cancelOrder")},
                  ],
                  { cancelable: true })
            }, 200);
        }else if(msg.resultStatus == "6002"){
            setTimeout(() => {
                Alert.alert(
                    I18n.t('Cancel payment'),
                    I18n.t("internet error"),
                    [
                      {text: I18n.t('Repay'), onPress: () => this.pay()},
                      {text: I18n.t('Cancel'), onPress: () => /* this.cancelOrder() */ console.log("cancelOrder")},
                    ],
                    { cancelable: true })
            }, 200);
        }else if(msg.resultStatus == "nil"){
            setTimeout(() => {
              Alert.alert(
                I18n.t("Processing payment"),
                I18n.t('Is payment completed?'),
                [
                  {text: I18n.t('Already paid'), onPress: () => this._confirmPaid()},
                  {text: I18n.t('Repay'), onPress: () => this.pay()},
                  {text: I18n.t('Cancel'), onPress: () => [this.listener.remove(),this.back()]},
                ],
                { cancelable: true })
            }, 200);
        }else if(msg.resultStatus == "updateSign"){
          // console.log("updateSign")
          this.orderAddAlipaySign(msg.sign, msg.outTradeNO);
        }else{
            setTimeout(() => {
              Alert.alert(
                I18n.t("Processing payment"),
                I18n.t('Is payment completed?'),
                [
                  {text: I18n.t('Already paid'), onPress: () => this._confirmPaid()},
                  {text: I18n.t('Repay'), onPress: () => this.pay()},
                  {text: I18n.t('Cancel'), onPress: () => [this.listener.remove(),this.back()]},
                ],
                { cancelable: true })
            }, 200);
        }
    }
  }else if(typeof(msg)==="undefined"){
    setTimeout(() => {
      Alert.alert(
          I18n.t("Unprocessed payment"),
          I18n.t("User Cancel"),
          [
            {text: I18n.t('Repay'), onPress: () => this.pay()},
            {text: I18n.t('Cancel'), onPress: () => /* this.cancelOrder() */ console.log("cancelOrder")},
          ],
          { cancelable: true })
    }, 200);
  }
  //this.refs.Loading.hide();
  }

  changeAddress(){
    Actions.AddressBook({onPayment:true, address:this.state.address});
  }

  onCheck(total, quantity){
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
        price:this.state.total.price?this.state.total.price + price : price,
        sprice:this.state.total.sprice?this.state.total.sprice + sprice: sprice,
        // points:this.state.total.points + (total.points?total.points:0 * quantity),
        // spoints:this.state.total.spoints + (total.spoints * quantity),
        // totalPrice:this.state.total.totalPrice + (((total.sprice?total.sprice:total.price)||0) * quantity),
        // totalPoints:this.state.total.totalPoints + (((total.spoints?total.spoints:total.points)||0) * quantity),
      };
  }

  render_product(){
    var cartList = this.state.products; 
    return cartList.map((product, i) => {
      this.onCheck(product.total, product.quantity)
      return(
        <View 
          key={i}  
          style={{
            flex:1,
            marginLeft:10,
            marginRight:10, 
            padding:0, 
            marginTop:0,
            borderRadius:15,
            alignItems:'center',
            backgroundColor:global.styles.bodyLight,
            borderBottomColor:global.styles.bottomBorder,
            borderBottomWidth:1,
            // borderStyle:'dashed',
            }}
          >
          <View style={{width:'100%',margin:10}}>
            <View style={{marginLeft:4, flexDirection:'row', marginTop:5}}>
              <View style={{}}>
                {/* <Image 
                    source={{uri: global.hostURL+'image/' + product.image}} 
                    style={{ borderRadius:5, borderTopRightRadius:5, width:100, height:100}}
                  /> */}
                  <ImageRP
                      style={{ width:110, height:110, resizeMode:'cover' , margin:3}}
                      loadingStyle={{ size: 'large', color: 'blue' }}
                      placeholderSource={require('../images/empty-image.png')}
                      source={this.image = global.storeMediaURL + 'catalog/product' + product.image}
                  />
              </View>
              <View style={{flex:1,marginLeft:5, marginRight:10}}>
                <Text numberOfLines={4} style={{fontSize:19* global.scale, fontWeight:'400', color:global.styles.text1}}>{product.pname}</Text>
              </View>
            </View>
            <View>
              {this.renderProductOptions(product.options)}
            </View>
            <View style={{flex:1, padding:3,  alignItems:'flex-end', justifyContent:'center' }}>
              <Text style={{fontSize:19, fontWeight:'400', color:global.styles.textLight3}}>{I18n.t('Quantity')} x{product.quantity}</Text>
              
              <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'flex-end'}}>
                <View style={{flex:1, }}/>
                <Text style={{fontSize:19, fontWeight:'400', color:global.styles.textLight3}}>{I18n.t('Subtotal')}</Text> 
                {/* {
                  product.total.points>0?
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Icon type='Octicons' name="ruby" style={{fontSize: 19  * global.scale, color: global.styles.ruby, marginLeft:5, marginTop:5}}/>
                    <Text style={{fontSize:20 * global.scale, color:global.styles.priceTxt, fontWeight:'bold'}}> {global.NumberFormat((product.total.spoints?product.total.spoints:product.total.points)*product.quantity)}</Text>
                  </View>:null
                }
                {
                  product.total.points>0 && product.total.price>0?
                  <View>
                    <Icon type='AntDesign' name='plus' style={{fontSize: 19 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:-4, marginTop:-4, marginLeft:2  }}/>
                  </View>:null
                }
                {product.total.price>0?
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Icon type='FontAwesome' name="money" style={{fontSize: 19 * global.scale, color: global.styles.ruby, marginLeft:5, marginTop:3}}/>
                    <Text style={{fontSize:20 * global.scale, color:global.styles.priceTxt, fontWeight:'bold'}}> {global.NumberFormat(parseFloat((product.total.sprice?product.total.sprice:product.total.price)*product.quantity).toFixed(2))}</Text>
                  </View>:null
                } */}
                <View style={{marginLeft:5}}>
                  <RenderPrice
                    fontSize={20}
                    oldPriceTxt={{alignSelf:'flex-end', alignItems:'flex-end', justifyContent:'flex-end'}}
                    price={product.total.price * product.quantity}
                    sprice={product.total.sprice * product.quantity}
                    from={product.total.from}
                    to={product.total.to}
                    dateNow={global.dateNow}
                  />
                </View>
              </View>
            </View>
          {/* <Text style={{fontSize:17, color:global.styles.text1}}>* {option.name} </Text>
          <Text style={{fontSize:17, color:global.styles.text1}}>{option.value}{option.unit||''}</Text> */}
        </View>
        </View>
      );
    });
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
              {/* <ColorView style={{width:41, height:41}} colorId={this.props.configurable_item_options[option.attribute_id]} /> */}
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
      <SafeAreaView style={styles.container}>
      <Statusbar backgroundColor={global.colors.background.statusBar}/>
        <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader 
            title={I18n.t('Confirm Order')}
            titleColor={global.colors.text.statusBar}
          />
        </View>
        <Loading ref={(Loading) => this.Loading = Loading} />
        <Content>
          <TouchableOpacity style={{
            flex:1,
            flexDirection:'row', 
            margin:6, 
            padding:6, 
            borderRadius:10,
            alignItems:'center',
            backgroundColor:global.styles.bodyLight}}
            onPress={()=>this.changeAddress()}
            >
            <Icon type='MaterialIcons' name="local-shipping" style={{fontSize: 38 * global.scale, color: global.styles.ruby, marginLeft:5}}/>
            <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
              {
                Object.keys(this.state.address).length>0?
                <View style={{flex:1, justifyContent:'center'}}>
                  <View style={{flexDirection:'row', alignItems:'center',marginTop:5}}>
                    <Icon type='EvilIcons' name="user" style={{fontSize: 34 * global.scale, color: global.styles.text1, marginLeft:5}}/>
                    <Text style={{fontSize:20 * global.scale, color:global.styles.text1, marginLeft:7 * global.scale}}>{this.state.address.firstname} {this.state.address.lastname}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center',marginTop:7}}>
                    <Icon type='AntDesign' name="phone" style={{fontSize: 24 * global.scale, color: global.styles.text1, marginLeft:5}}/>
                    <Text style={{fontSize:17 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}> {global.omitString(this.state.address.telephone)}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center',marginTop:7, marginBottom:5, marginRight:10}}>
                    <Icon type='EvilIcons' name="location" style={{fontSize: 30 * global.scale, color: global.styles.text1, marginLeft:5}}/>
                    <Text style={{fontSize:17 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}>{global.omitString(this.state.address.street.join(" ")||"")}, {this.state.address.city}</Text>
                  </View>
                </View>
                :
                <Text style={{fontSize:16 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}>{I18n.t('Please Set Your Shipping Address')}</Text>
              }
            </View>
            <Icon type='AntDesign' name="right" style={{fontSize: 26 * global.scale, color: global.styles.ruby}}/> 
          </TouchableOpacity>
          <View>
            {
              this.props.gift?
              <View style={{
                flex:1,
                flexDirection:'row', 
                margin:6, 
                padding:6, 
                marginTop:0,
                borderRadius:10,
                alignItems:'center',
                backgroundColor:global.styles.bodyLight
                }}>
                <Icon type='Octicons' name="gift" style={{fontSize: 42 * global.scale, color: global.styles.ruby, marginLeft:5}}/>  
                <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                  <View style={{flexDirection:'row', alignItems:'center',marginTop:5}}>
                    <Icon type='EvilIcons' name="user" style={{fontSize: 34 * global.scale, color: global.styles.text1, marginLeft:5}}/>
                    <Text style={{fontSize:20 * global.scale, color:global.styles.text1, marginLeft:7 * global.scale}}>{this.props.gift.nickname}</Text>
                  </View>

                  <View style={{flexDirection:'row', alignItems:'center',marginTop:5}}>
                    <Icon type='AntDesign' name="phone" style={{fontSize: 24 * global.scale, color: global.styles.text1, marginLeft:5}}/>
                    <Text style={{fontSize:17 * global.scale, color:global.styles.textLight1, marginLeft:7 * global.scale}}> {global.omitString(this.props.gift.phone)}</Text>
                  </View>
                </View>
              </View>:null
            }
          </View>
          {this.state.total.sprice>0?<View style={{
            flex:1,
            margin:6, 
            padding:6, 
            marginTop:0,
            borderRadius:10,
            alignItems:'center',
            backgroundColor:global.styles.bodyLight
            }}>
            <Text style={{fontSize:20, fontWeight:'500', color:global.styles.textLight3}}>{I18n.t('Payment Method')}</Text>
            <View style={{width:'100%', marginLeft:5}}>
              <PaymentMethod image={require('../images/pay_paypal.png')} name={I18n.t("Paypal or Credit Card")} method='paypal' value={this.state.paymentMethod} onCheck={(val) => this.setState({paymentMethod:val})} />
              <PaymentMethod image={require('../images/alipay.png')} name={I18n.t("Alipay")} method='alipay' value={this.state.paymentMethod} onCheck={(val) => this.setState({paymentMethod:val})} />
            </View>
          </View>:null}
          <View style={{
            flex:1,
            margin:6,  
            marginTop:0,
            borderRadius:15,
            alignItems:'center',
            overflow:'hidden',
            // backgroundColor:global.styles.bodyLight
            }}>
            {this.render_product()}
          </View>
        </Content>
        <View style={{
          flexDirection:'row',
          height:65,
          marginTop:0,
          alignItems:'center',
          backgroundColor:global.styles.bodyLight
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
              onPress={()=>this.paySubmit()}
              style={{backgroundColor:global.styles.btn, margin:8, borderRadius:20, padding:3, alignItems:'center', justifyContent:'center'}}>
              <View style={{flex:1, alignItems:'center', justifyContent:'center', }}>
                <Text style={{ fontSize:16, fontWeight:'bold', marginLeft:15, marginRight:15, color:global.styles.text1 }}>{I18n.t('Add Order')}</Text>
              </View>
            </TouchableOpacity>
        </View> 
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor:global.styles.bodyLight}} />
      </Container>
    );
  }
}
 
const mapStateToProps = ({ user, relatedSim, }) => ({ user, relatedSim, });
export default connect(mapStateToProps,{ fetchingData })(PaymentOrders);