import React, { Component } from 'react';
import { 
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView
} from 'react-native';
import {
  Container,
  Content,
  Footer,
  Icon
} from 'native-base'

import { connect } from 'react-redux' 
import Share, {ShareSheet} from 'react-native-share';
import Toast, {DURATION} from 'react-native-easy-toast'
import Carousel from 'react-native-banner-carousel';
import { Actions } from 'react-native-router-flux';

import I18n from '../langs'
import Statusbar from './Statusbar';
import MyHeader from './MyHeader'
import { addItems } from '../actions/shoppingCart'
import { addWishList } from '../actions/wishlist'
import { fetchingData, fetchData } from '../actions/fetch'
import Banner from './Banner'
import WebView from './webViewAutoHeight'
// import Spinner from 'react-native-loading-spinner-overlay';
import {LoadingWithoutModal} from './LoadingWithoutModal';
import PriceOptions from './PriceOptions'
import OptionsSet from './OptionsSet';
import RenderPrice from './RenderPrice';

import FavView from './FavView';

import ImageRP from "./ResponsiveImage";

var moment = require('moment');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const win = Dimensions.get("window");
const BannerWidth = Dimensions.get('window').width;
let lang = I18n.currentLocale()
 
const styles = StyleSheet.create({
  separator:{
    height:1,
    width: '90%',
    backgroundColor:'#ccc',
    alignSelf:'center'
  },
  list_container:{
    flexDirection:'column',
    justifyContent: 'space-evenly',
    alignItems:'center',
    paddingHorizontal: "0%",
    borderWidth:0,
    margin:10
  },
  history_product:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal: "0%",
    borderWidth:0,
  }
});
 
class ProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initCount:0,
      initTotal:0,
      stockStatus:0,
      initData:[],
      spinner: true,
      scrollOffset:0,
      selectedPrice:'',
      onLoading:true,
      Quantity:1,
      configurableList:[],
      attributeList:{},
      configurable_item_options:{},
      configurableKeys:{}
    };
    this.images = [];
    this.price_option = []
    global.allowedList = [];
    global.image = null;
    this.address=this.props.user.user.address?this.props.user.user.address:{};
    // this.renderItemData = this.props[this.props.listSet].productList['p'+this.props.parent][this.props.rowNum];
    this.renderItemData = this.props.product;
  }

  componentDidMount(){
    // this.loadData();
  }

  componentWillMount(){
    this.loadData();
    
  }

  componentDidUpdate(){
    console.log("componentDidUpdate")
  }

  loadData(){
    if(global.InitData == global.InitDataCount){
      this.fetchData();
      this.checkStockStatus(this.renderItemData.sku);
      if(this.renderItemData.type_id=="configurable"){
        this.checkConfigurable(this.renderItemData.sku);
        this.getConfigurableOptions(this.renderItemData.sku)
      }
    }else{
      setTimeout(() => {
        this.loadData();
      }, 1000);
    }
  }

  fetchData(){
    this.state.initTotal++;
    // global.InitData++;
    this.props.fetchData({
      start:'FETCH_PRODUCT_IMAGES_START',
      next:'FETCH_PRODUCT_IMAGES_SUCCESS', 
      rejected:'FETCH_PRODUCT_IMAGES_ERROR', 
      method:'POST',
      url:'products/media/'+this.renderItemData.sku,
      data:{
        "lang":I18n.currentLocale()
      },
      callback:(data, isError)=>this.onInit(data, isError, "media")
    });
  }

  checkStockStatus(sku){
    this.state.initTotal++;
    this.props.fetchData({
      start:'FETCHING_PRODUCT_stockStatuses_START',
      next:'FETCHING_PRODUCT_stockStatuses_SUCCESS',
      rejected:'FETCHING_PRODUCT_stockStatuses_ERROR',
      method:'POST',
      url:'products/stockQty/'+sku,
      data:{'lang': lang,},
      callback:(data, isError)=>this.onInit(data, isError, "stockStatuses")
    });
  }

  checkConfigurable(sku){
    this.state.initTotal++;
    this.props.fetchData({
      start:'FETCHING_PRODUCT_configurable_START',
      next:'FETCHING_PRODUCT_configurable_SUCCESS',
      rejected:'FETCHING_PRODUCT_configurable_ERROR',
      method:'POST',
      url:'products/configurable/'+sku,
      data:{'lang': lang,},
      callback:(data, isError)=>this.onInit(data, isError, "configurable")
    });
  }

  getConfigurableOptions(sku){
    this.state.initTotal++;
    this.props.fetchData({
      start:'FETCHING_PRODUCT_configurableOptions_START',
      next:'FETCHING_PRODUCT_configurableOptions_SUCCESS',
      rejected:'FETCHING_PRODUCT_configurableOptions_ERROR',
      method:'POST',
      url:'products/configurableOptions/'+sku,
      data:{'lang': lang,},
      callback:(data, isError)=>this.onInit(data, isError, "configurableOptions")
    });
  }

  getAttributes(id, type){
    this.state.initTotal++;
    this.props.fetchData({
      start:'FETCHING_PRODUCT_attributes_START',
      next:'FETCHING_PRODUCT_attributes_SUCCESS',
      rejected:'FETCHING_PRODUCT_attributes_ERROR',
      method:'POST',
      url:'products/attributes/'+id,
      data:{'lang': lang,},
      callback:(data, isError)=>this.onInit(data, isError, "attributes"+"_"+type)
    });
  }

  onInit(data, isError, type){
    this.state.initCount++;
    // global.InitDataCount++;
    switch (type) {
      case "media":
        if(isError){
          this.images = [{"image":this.renderItemData.custom_attributes.image}];
          this.imageResizeMode = 'contain';
        }else{
          this.images = data.data;
          this.imageResizeMode = 'contain';
        }
        break;
      case "stockStatuses":
        if(typeof(data.data)=="object" && data.data != null){
          if(data.data.stock_status && data.data.stock_status > 0){
            this.state.stockStatus = this.state.stockStatus + 1;
          }
        }
        break;
      case "configurable":
        if(Array.isArray(data.data)){
          data.data.forEach(d => {
            
            let ca = {};
            d.custom_attributes.forEach(a => {
              ca[a.attribute_code] = a.value;
            });
            d.custom_attributes = ca;
            this.state.configurableList.push(d);
          });
        }
        break;
      case "configurableOptions":
        if(Array.isArray(data.data)){
          // this.state.attributeList = data.data;
          data.data.forEach(attr => {
            this.state.attributeList[attr.attribute_id] = attr;
            this.getAttributes(attr.attribute_id, "configurable");
          });
        }
        break;
      case "attributes_configurable":
        data.data.is_required = true;
        // if(!this.state.configurableKeys[data.data.attribute_code]){
          this.state.configurableKeys[data.data.attribute_code]='';
        // }
      case "attributes":
        if(data.data){
          if(data.data.is_visible){
            this.state.attributeList[data.data.attribute_id]['code'] = data.data.attribute_code;
            this.state.attributeList[data.data.attribute_id]['type'] = data.data.frontend_input;
            this.state.attributeList[data.data.attribute_id]['is_required'] = data.data.is_required;
            if(data.data.is_required){
              this.state.configurable_item_options[data.data.attribute_id] = null;
            }
            this.state.attributeList[data.data.attribute_id].values.forEach((i,index) => {
              data.data.options.forEach(o => {
                if(i.value_index == o.value){
                  this.state.attributeList[data.data.attribute_id].values[index]['label'] = o.label;
                  return false;
                }
              });
            });
          }
        }
        break;
      default:
        break;
    }
    
    
    if(this.state.initCount >= this.state.initTotal){
      if(this.state.stockStatus==0){
        // setTimeout(() => {
        //   Alert.alert(
        //     "",
        //     I18n.t("Sold Out"),
        //     [
        //       // {text: I18n.t('Cancel'), onPress: () => console.log('OK Pressed')},
        //       {text: I18n.t('OK'), onPress: () => Actions.pop()}
        //     ],
        //     {cancelable: false}
        //   );
        // }, 200);
        this.setState({
          onLoading:false
        })
        setTimeout(() => {
          this.refs.toast.show(I18n.t("Sold Out"), 1000);
        }, 1000);
      }else{
        // Object.keys(this.state.attributeList).forEach(key => {
        //   this.state.configurable_item_options[key] = this.state.configurableList[0].custom_attributes[this.state.attributeList[key].code];
        // });
        this.setState({
          onLoading:false
        })
      }
      
    }
  }


  loadCallback(data,isError){
    
  }

  _getRelatedProduct(){
    this.props.fetchingData({
      start:'FETCHING_RELATED_PRODUCT_START',
      next:'FETCHING_RELATED_PRODUCT_SUCCESS',
      rejected:'FETCHING_RELATED_PRODUCT_ERROR',
      method:'post',
      url:'getrelatedproduct.php',
      data:{'product_id':this.renderItemData.id,},
      callback:this._customerProductHistory()
    })
  }

  _customerProductHistory(){
    this.setState({
      onLoading:false
    })
    this.props.fetchingData({
      start:'FETCHING_CUSTOMER_PRODUCT_HISTORY_START',
      next:'FETCHING_CUSTOMER_PRODUCT_HISTORY_SUCCESS',
      rejected:'FETCHING_CUSTOMER_PRODUCT_HISTORY_ERROR',
      method:'post',
      url:'customerProductHistory.php',
      data:{ product_id:this.renderItemData.id, customer_id: this.props.user.user.customer_id, language_id: lang },
    })
  }

  _renderShoppingCartIcon(){
    let n = this.props.shoppingCart.cartList.length;
    let ml = 10;
    if(n > 99){
      n = "99+";
      ml = 18;
    }
    return(
      <TouchableOpacity onPress={() => Actions.ShoppingCart()} >
        <ImageBackground source={require('../images/btn_cart.png')} style={{ borderWidth:0, width:42*global.scale, height:42*global.scale, alignItems:'center', marginRight:10 }}>
          {n?<Text style={{marginLeft:ml * global.scale, fontSize:16 * global.scale, width:'100%', marginTop:0, textAlign:'center', color:global.styles.bodyLight}}>{n}</Text>:null}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  _addItems(){
    if(this.state.selectedPrice === ''){
      console.log(this.state.selectedPrice)
      Alert.alert(
        I18n.t("Please Select Price")
      ),
      [{text: I18n.t('OK'), onPress: () =>  console.log("Press OK")}],
      {cancelable: false}
    }else{
      this.refs.toast.show('Add One Item', 500);
      this.props.addItems({item:this.props.item, selectedPrice:this.state.selectedPrice})
    }
    
    // if(this.props.user.user.email && this.props.user.user.password){
    //   this.refs.toast.show('Add One Item', 500);
    //   this.props.addItems({item:this.props.item, selectedPrice:this.state.selectedPrice})
    // }else{
    //   Alert.alert(I18n.t('Login required'),
    //       I18n.t('Go to Login'),
    //       [
    //         {text: I18n.t('Cancel'), onPress: () => console.log('OK Pressed')},
    //         {text: I18n.t('Yes'), onPress: () => Actions.Login({back:true})}
    //       ],
    //       { cancelable: false })
    // }
  }

  gotoCart(){
    if(this.props.user.user.email && this.props.user.user.token){
      Actions.Cart()
    }else{
      Alert.alert(I18n.t('Login required'),
          I18n.t('Go to Login'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('OK Pressed')},
            {text: I18n.t('Yes'), onPress: () => Actions.Login({back:true})}
          ],
          { cancelable: false })
    }
  }

  _setCheckoutType(type){
    this.setState({
      checkoutType:type
    })
  }

  _addWishList(product_id){
    // <Spinner visible={this.state.spinner} textContent={'Loading...'} />
    // this.props.fetchingData({
    //   start:'FETCHING_ADD_WISHLIST_START',
    //   next:'FETCHING_ADD_WISHLIST_SUCCESS',
    //   rejected:'FETCHING_ADD_WISHLIST_ERROR',
    //   method:'POST',
    //   url:'addwishlist.php',
    //   data:{product_id:product_id, customer_id: this.props.user.id,},
    //   callback:this._spinnerOff()
    // })
    if(this.props.user.user.email && this.props.user.user.token){
      this._spinnerOff();
    }else{
      Alert.alert(I18n.t('Login required'),
          I18n.t('Go to Login'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('OK Pressed')},
            {text: I18n.t('Yes'), onPress: () => Actions.Login({back:true})}
          ],
          { cancelable: false })
    }
  }
  
  _spinnerOff(){
    // this.setState({
    //   spinner:false    

    // })
    this.refs.toast.show('Add to Wishlist', 500);
  }

  _renderRewardPointProduct(item){
    return(
      <View style={{ borderWidth:1,borderColor:'#B0C5FC', margin:5, }}>
        <TouchableOpacity>
          <ImageRP source={global.hostURL+'image/' + item.item.image + '.png'} style={{ width:85, height:85, resizeMode:'contain'}}/>
          <View style={{ justifyContent:'center', alignItems:'center'}}>
            <Text style={{ padding:2, fontSize:16, color:'#B0C5FC'}}>{ item.item.productName }</Text>
          </View>
          <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Icon type='Octicons' name="ruby" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, marginTop:5}}/>
            <Text style={{ fontSize:20, color:'deeppink'}}>{item.item.point}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ justifyContent:'center', alignItems:'center', backgroundColor:'#B0C5FC', borderWidth:0}} onPress={ () => this._addWishList(item.item.id) }>
          <Text style={{ color:'white', padding:4}}>WishList</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderRelatedProduct(item){
    return(
      <TouchableOpacity onPress={ ()=> item.item.model == "SIM" ? Actions.SimDetail({...item.item, pname: item.item.name}) : Actions.ProductDetail({item:item.item})} style={{ borderWidth:0, borderColor:'#B0C5FC', justifyContent:'flex-start', alignItems:'center', margin:5 }}>
        <ImageRP source={global.hostURL + 'image/' + item.item.image } style={{ width:100, height:125, resizeMode:'contain'}}/>
        <Text numberOfLines={2} style={{ fontWeight:'600', fontSize:18, color:global.styles.textLight1, width:100, borderWidth:0,}}>{item.item.productName}</Text>
        {/* <View style={{ flexDirection:'row' }}>
          <Icon type='Octicons' name="ruby" style={{fontSize: 20, color: global.styles.ruby, marginRight:5, }}/>
          <Text style={{ color: global.styles.text }}>{item.item.options[0].price_option_value[0].price}</Text>
        </View> */}
      </TouchableOpacity>
    );
  }

  _renderHistoryProduct(item){
    return (
      <TouchableOpacity onPress={ ()=> item.item.model == "SIM" ? Actions.SimDetail({item:item.item, pname: item.item.name}) : Actions.ProductDetail({item:item.item})} style={{ borderWidth:0, borderColor:'#B0C5FC', justifyContent:'flex-start', alignItems:'center', margin:5 }}>
        <ImageRP source={global.hostURL + 'image/' + item.item.image } style={{ width:100, height:125, resizeMode:'contain'}}/>
        {/* <Text numberOfLines={2} style={{ fontWeight:'600', fontSize:18, color:global.styles.textLight1, width:100, borderWidth:0,}}>{item.item.name}</Text> */}
      </TouchableOpacity>
    )
    // if(this.props.customerHistory.isFetching){
    //   return (
    //     <View/>
    //   )
    // }else{
    
    // }
    
  }

  handleScroll(event){
    this.setState({scrollOffset:event.nativeEvent.contentOffset});
  }

  updateOption(data){
    // let opt = this.state.options;
    // let index = data.index;
    // opt[index]['updateValue']=data.val;
    // opt[index]['Id']=data.id||opt[index]['Id'];
    // opt[index]['option_id']=data.option_id||opt[index]['option_id'];
    // opt[index]['product_option_id']=data.product_option_id||opt[index]['product_option_id'];
    // opt[index]['Unit']=data.unit||opt[index]['Unit'];
    // if(data.update_total==1){
    //   let _total = this.state.total;
    //   _total[index] = data.val;
    //   this.setState({
    //     total:_total
    //   })
    // }
    this.setState({Quantity:data});
  }

  render() {
    // this.renderItemData = this.props[this.props.listSet].productList['p'+this.props.parent][this.props.rowNum];
    let shareOptions = {
      title: I18n.t("efun_Sim_Share_Title"),
      message: I18n.t("efun_Sim_Share_Message"),
      subject: "efun_Sim_Share_subject" //  for email
    };

    if(this.state.onLoading){
      return (
        <Container>
          <Statusbar backgroundColor={global.colors.background.statusBar}/>
          <View style={{  backgroundColor:global.colors.background.statusBar }}>
            <MyHeader 
              // title={I18n.t("Product")}
              title={this.renderItemData.name}
              titleColor={global.colors.text.statusBar} 
              renderRight={this._renderShoppingCartIcon()}
            />
          </View>
          <View style={{flex:1}}>
            <LoadingWithoutModal style={{backgroundColor:global.colors.background.body}} Color={global.colors.text.t2} textColor={global.colors.text.t2} ref="Loading" isShow={true} text={'Loading...'} />
          </View>
        </Container>
      );
    }else{
      this.price_option = [];
      this.base_price_option = [];
      // this.renderItemData.options.forEach(option => {
      //   if(option.key == 'priceOption'){
      //     let price = [];
      //     let base_price = [];
      //     price['product_option_value_id'] = [];
      //     price['option_value_id'] = []

      //     base_price['product_option_value_id'] = [];
      //     base_price['option_value_id'] = []

      //     option.product_option_value.forEach(option_value => {
      //       price['product_option_value_id'].push(option_value.product_option_value_id);
      //       price['option_value_id'].push(option_value.option_value_id);

      //       base_price['product_option_value_id'].push(option_value.product_option_value_id);
      //       base_price['option_value_id'].push(option_value.option_value_id);

      //       if(option_value.key=='price'){
      //         price['price']=option_value.value * this.state.Quantity;
      //         base_price['price']=option_value.value;
      //         if(price['price']>999){
      //           big = true;
      //         }
      //       }else if(option_value.key=='points'){
      //         price['points']=option_value.value * this.state.Quantity;
      //         base_price['points']=option_value.value;
      //         if(price['points']>999){
      //           big = true;
      //         }
      //       }else if(option_value.key=='sprice'){
      //         price['sprice']=option_value.value * this.state.Quantity;
      //         base_price['sprice']=option_value.value;
      //         if(price['sprice']>999){
      //           big = true;
      //         }
      //       }else if(option_value.key=='spoints'){
      //         price['spoints']=option_value.value * this.state.Quantity;
      //         base_price['spoints']=option_value.value;
      //         if(price['spoints']>999){
      //           big = true;
      //         }
      //       }
      //     });
      //     if(price){
      //       this.price_option.push(price);
      //       this.base_price_option.push(base_price);
      //     }
      //   }
      // });

      let shareOptions = {
        title: "好嘢介紹比你",
        message: '朋友仔，我有好嘢介紹比你 "'+this.renderItemData.name+'". \n\n'+global.storeURL+this.renderItemData.sku,
        subject: '朋友仔，我有好嘢介紹比你 "'+this.renderItemData.name //  for email
      };

      /*
        // this.state.options.forEach(option => {
        //   if(option.key == 'priceOption'){
        //     let price = [];
        //     price['product_option_value_id'] = [];
        //     price['option_value_id'] = []
        //     option.product_option_value.forEach(option_value => {
        //       price['product_option_value_id'].push(option_value.product_option_value_id);
        //       price['option_value_id'].push(option_value.option_value_id);
        //       if(option_value.key=='price'){
        //         price['price']=option_value.value;
        //         if(price['price']>999){
        //           big = true;
        //         }
        //       }else if(option_value.key=='points'){
        //         price['points']=option_value.value;
        //         if(price['points']>999){
        //           big = true;
        //         }
        //       }else if(option_value.key=='sprice'){
        //         price['sprice']=option_value.value;
        //         if(price['sprice']>999){
        //           big = true;
        //         }
        //       }else if(option_value.key=='spoints'){
        //         price['spoints']=option_value.value;
        //         if(price['spoints']>999){
        //           big = true;
        //         }
        //       }
        //     });
        //     if(price){
        //       price_option.push(price)
        //     }
        //   }
        // });
      */
      console.log("'length' of null", this.images);
      if(this.renderItemData.custom_attributes.description==undefined){
        this.renderItemData.custom_attributes.description = "";
      }
      let in_stock = true;
      if(this.renderItemData.extension_attributes && this.renderItemData.extension_attributes.stock_item){
        in_stock = this.renderItemData.extension_attributes.stock_item.is_in_stock;
      }
      return (
        <Container>
          <Statusbar backgroundColor={global.colors.background.statusBar}/>
          <Toast
            ref="toast"
            style={{backgroundColor:'#0009'}}
            position='bottom'
            positionValue={150}
            fadeInDuration={250}
           />
          <View style={{  backgroundColor:global.colors.background.statusBar }}>
            <MyHeader 
              // title={I18n.t("Product")}
              title={this.renderItemData.name}
              titleColor={global.colors.text.statusBar} 
              renderRight={this._renderShoppingCartIcon()}
            />
          </View>
          <ScrollView 
            style={{flex:1}}  
            onScroll={(e)=>this.handleScroll(e)} ref={c => (this.content = c)}
            bounces={false}
            >
            {/* <View style={{ justifyContent:'center', alignItems:'center'}}>
              <Image source={{ uri:global.hostURL+'image/' + this.renderItemData.image}} style={{ width:win.width / 1.1, height: 150, borderRadius:8, marginTop:4, resizeMode: 'contain', }}/>
            </View> */}
            <View>
              <Carousel
                autoplay={false}
                // autoplayTimeout={10000}
                loop
                showsPageIndicator={this.images.length>1?true:false}
                index={0}
                pageSize={BannerWidth}
                pageIndicatorContainerStyle={{alignItems:'flex-end', alignSelf:'flex-end', paddingRight:7}}
                >
                    {this.images.map((image, index) => 
                    (<Banner 
                      style={{
                        width:win.width, 
                        height:250,
                        borderRadius:0,
                        resizeMode:'contain'
                        }
                      } 
                      resizeMode = {this.imageResizeMode}
                      containerStyle={{
                        margin:0,
                        overflow:'visible',
                        borderRadius:0}
                      }
                      activeOpacity={1}
                      banner={global.storeMediaURL + 'catalog/product' + image.file}/>)
                  )}
                </Carousel>
                {
                  in_stock == false?
                  <View style={{width:'100%', backgroundColor:"#0006", position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#def', margin:3}}>{I18n.t('Sold Out')}</Text>
                  </View>
                  :null
                }
              </View>
            <View>
              {/* <View style={styles.separator}/> */}
              <View style={{alignItems:'center', marginTop:2}}>
                <Image source={require('../images/barLine1.png')} style={{width:"100%", height:1}} />
              </View>

              {/* <View style={{ flexDirection:'row', margin:10, marginTop:10, marginBottom:0}}>
                <View style={{ flex:1, flexDirection:'row', marginLeft:10, justifyContent:'center', alignItems:'center'}}>
                  <Image source={require('../images/icon_point_max.png')} style={{width:34*0.8, height:30*0.8}} />
                  <Text style={{ color:'black', fontSize:18 }}> {I18n.t('Valid Points')}{global.NumberFormat(this.props.user.user.points)}</Text>
                </View>
              </View> */}

              {/* <View style={{flex:1,  margin:5}}>
                <PriceOptions onSelect={(val)=>this.setState({selectedPrice:val}) } options={this.price_option} offset={this.state.scrollOffset}/>
              </View> */}

              <View style={{flex:1, flexDirection:'row', marginTop:5, alignItems:'center', justifyContent:'center'}} >
                <View style={{marginLeft:20}}>
                  <RenderPrice
                    uFontSize={15 * global.scale}
                    fontStyle={{fontSize:22 * global.scale, fontWeight:'bold'}}
                    style={{alignItems:'flex-start', justifyContent:'flex-start' }}
                    oldPriceTxt={{alignSelf:'flex-end', marginBottom:-3}}
                    price={this.renderItemData.price}
                    sprice={this.renderItemData.custom_attributes.special_price}
                    // sprice={100}
                    from={this.renderItemData.custom_attributes.special_from_date}
                    to={this.renderItemData.custom_attributes.special_to_date}
                    dateNow={global.dateNow}
                  />
                </View>
                <View style={{flex:1}} />
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <TouchableOpacity 
                    style={{marginLeft:10,}}
                    onPress={()=>{
                      setTimeout(() => {
                        Share.open(shareOptions)
                        .then((res) => { console.log(res) })
                        .catch((err) => { err && console.log(err); });
                      },300);
                    }}
                    >
                    <Image source={require('../images/btn_share.png')} style={{width:40*0.9, height:40*0.9}} />
                  </TouchableOpacity>
                  <FavView 
                    sku={this.renderItemData.sku}
                    onAdded={() => this.refs.toast.show('Added to Wishlist', 500)}
                    />
                </View>
              </View>

              <View style={{marginTop:10}}>
                <Text style={{ margin:5, fontWeight:'bold', marginLeft:'3%', fontSize:17,color:global.colors.text.d1 }}>{this.renderItemData.name}</Text>
              </View>

              <View style={{alignItems:'center'}}>
                <Image source={require('../images/barLine1.png')} style={{width:"96%", height:1}} />
              </View>
              
              {
                this.renderItemData.type_id == "simplan"?
                this.renderSimAttributes(this.renderItemData.custom_attributes)
                :
                null
              }
              
              <View style={{ width: BannerWidth}}>
                <WebView
                  // scalesPageToFit={true}
                  style={{width: BannerWidth}}
                  containerStyle={{width: BannerWidth, marginBottom:80}}
                  source={{ html: `
                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=yes">
                            <style>
                            img{width: 100%!important;height: auto!important; margin: 0px!important; padding: 0px!important; font: inherit;}
                            iframe{width: 100%!important; margin: 0px!important; padding: 0px!important; font: inherit;}
                            p{margin-left:10px; margin-right:10px}
                            li{margin-left:5px; margin-right:10px}
                            </style>
                            <body>`
                            +entities.decode(this.renderItemData.custom_attributes.description.replace(/{{media url="/g, global.storeMediaURL).replace(/"}}/g, ''))+
                            `<p/><p/></body>`}}
                />
              </View>
            </View>
            {/* Recommend Related Product */}
            {
              this.props.relatedProduct.data.length>0?
              <View style={{ flex:1, borderWidth:1, borderTopWidth:.5, borderLeftWidth:.5, borderColor:'lightgrey', margin:4, }}>
                <Text style={{ color:global.colors.text.statusBar, fontSize:20, fontWeight:'600', padding:10}}>{I18n.t("Recommend Related Product")}</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{flex:1}}
                  data={ this.props.relatedProduct.data }
                  renderItem={ this._renderRelatedProduct }
                />
              </View>:null
            }
  
            {/* History Product */}
            {/*
              this.props.customerHistory.data.length>0?
              <View style={{ borderWidth:1, borderTopWidth:.5, borderLeftWidth:.5, borderColor:'lightgrey', overflow:'hidden', margin:4, }}>
                <Text style={{ color:global.colors.text.statusBar, fontSize:20, fontWeight:'600', padding:10}}>History Product:</Text>
                {
                  <FlatList
                    style={{width:win.width}}
                    scrollEnabled={true}
                    horizontal={true}
                    contentContainerStyle={styles.history_product}
                    data={ this.props.customerHistory.data }
                    renderItem={ this._renderHistoryProduct }
                  />
                }
              </View>:null
            */}
          </ScrollView>
          {
            <TouchableOpacity 
                style={{
                  position:'absolute',
                  bottom:20,
                  right:15,
                  }}
                  onPress={()=>this.showPayment()}
              >
                <Image 
                  source={this.state.selectedPrice === ''?require('../images/btn_add_to_cart1.png'):require('../images/btn_add_to_cart2.png')} 
                  style={{
                    width:85 * global.scale, 
                    height:77 * global.scale, 
                    // borderRadius:40* global.scale, 
                    // marginRight:10* global.scale,
                    }} />
            </TouchableOpacity>
          }
          
        </Container>
      );
    }
    
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

  updateOnPay(val){
    this.setState({
      onPay:val,
      lockQSet:val
    })
  }

  updateConfigurableOptions(val){
    this.state.configurable_item_options=val;
    // this.state.configurable_item_options = val;
  }

  showPayment(){
    if(this.props.user.user.email && this.props.user.user.token){
      // if(this.state.selectedPrice === ''){
      //   console.log(this.state.selectedPrice)
      //   Alert.alert(
      //     I18n.t('Select Your Price')
      //   ),
      //   [{text: I18n.t('OK'), onPress: () =>  console.log("Press OK")}],
      //   {cancelable: false}
      // }else{
        let Options = [];
        // this.renderItemData.options.forEach(option => {
        //   if(option.key!="priceOption"){
        //     Options.push(
        //       {
        //         "product_option_id": option.product_option_id,
        //         "product_option_value": [{Id:option.Id, value:option.updateValue, unit:option.Unit}],
        //         "option_id": option.option_id,
        //         "key":option.key,
        //         "type":option.type,
        //         "name": option.name
        //       }
        //     )
        //   }
        // });

        
        // this.state.attributeList.forEach(attr => {
        // for (var key of Object.keys(this.state.attributeList)) {
        //   let data = {};
          
        //   data['label'] = this.state.attributeList[key].label;
        //   data['option_id'] = this.state.attributeList[key].attribute_id;
        //   data['type'] = this.state.attributeList[key].type;
        //   data['code'] = this.state.attributeList[key].code;
        //   // data['options'] = [];
        //   // this.state.attributeList[key].values.forEach(value => {
        //   //   let option = {};
        //   //   // this.state.configurableList.filter
        //   //   this.state.configurableList.forEach((item, index) => {
        //   //     let option_value = item.custom_attributes[this.state.attributeList[key].code];
        //   //     if(value.value_index == option_value){
        //   //       // this.state.configurableList[index]['label'] = value.label;
        //   //       // this.state.configurableList[index]['option_value'] = option_value;
        //   //       // this.state.configurableList[index]['option_id'] = attr.attribute_id;
                
        //   //       option['option_value'] = option_value;
        //   //       option['label'] = value.label;
        //   //       // let relation = [];
        //   //       // for (var relation_keys of Object.keys(this.state.configurableKeys)) {
        //   //       //   // relation[relation_keys] = item.custom_attributes[relation_keys];
        //   //       //   relation.push(item.custom_attributes[relation_keys]);
        //   //       // }
        //   //       // option['relation'] = relation;
        //   //       // option['price'] = item.price;
        //   //       // option['special_price'] = item.custom_attributes.special_price;
        //   //       // option['special_from_date'] = item.custom_attributes.special_from_date;
        //   //       // option['special_to_date'] = item.custom_attributes.special_to_date;
        //   //       // option['image'] = item.custom_attributes.thumbnail;
        //   //       // option['short_description'] = item.custom_attributes.short_description;

        //   //       // option.push(data);
        //   //     }
        //   //   });
        //   //   data['options'].push(option);
        //   // });
        //   // let aaa = {...data};
        //   // aaa.option_id = 191;
        //   // Options.push(aaa);
        //   Options.push(data);
        // };
        if(!global.image)
          global.image = this.renderItemData.custom_attributes.thumbnail;
        Actions.OrderPreviewPop({
          updateOnPay:(val)=>this.updateOnPay(val),
          updateConfigurableOptions:(val)=>this.updateConfigurableOptions(val),
          // onAddressChange:()=>this.onAddressChange(),
          // total:this.state.total,
          product_id:this.renderItemData.id,
          model:this.renderItemData.type_id,
          sku:this.renderItemData.sku,
          // image:this.renderItemData.custom_attributes.thumbnail,
          pname:this.renderItemData.name,
          total:{...this.base_price_option[this.state.selectedPrice]},
          basePrice:{...this.base_price_option[this.state.selectedPrice]},
          options:this.state.attributeList,
          configurableList:this.renderItemData.type_id=="configurable"?this.state.configurableList:[this.renderItemData],
          configurable_item_options:this.state.configurable_item_options,
          configurableKeys:this.state.configurableKeys,
          balance:this.props.user.user.points,
          // quantity:this.state.Quantity,
          address:this.address,
          gift:this.props.relatedSim.onSelect>0?this.props.relatedSim.simList[this.props.relatedSim.onSelect-1]:null
        })
      // }
    }else{
      Alert.alert(I18n.t('Login required'),
          I18n.t('Go to Login'),
          [
            {text: I18n.t('Cancel'), onPress: () => console.log('OK Pressed')},
            {text: I18n.t('Yes'), onPress: () => Actions.Login({back:true})}
          ],
          { cancelable: false })
    }
  }

}
 
const mapStateToProps = ({ relatedSim, shoppingCart, relatedProduct, user, customerHistory, homeCategory, simHome }) => ({ relatedSim, shoppingCart, relatedProduct, user, customerHistory, homeCategory, simHome })
export default connect( mapStateToProps, { addItems, addWishList, fetchingData, fetchData })(ProductView);