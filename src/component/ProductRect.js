import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  Keyboard,
  InteractionManager,
  ActivityIndicator
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Icon,
  Header,
  Item,
  Button,
  Input
} from 'native-base';
import I18n from '../langs';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { fetchData } from '../actions/fetch';
import ImageLoaderBase64 from './ImageLoaderBase64';
import RenderPrice from './RenderPrice';

// import moment from 'moment';
var moment = require('moment');
let lang = I18n.currentLocale();

const win = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf:'center'
  }
});
 
class ProductRect extends Component {

  constructor(props){
    super(props);
    this.state={
      onLoading:false,
      initCount:0,
      initTotal:0,
      initData:[],
      stockStatus:0,
      outStock:false
    }
  }

  componentDidMount(){
    // this.loadProduct();
  }

  componentWillMount(){
    this.loadProduct();
  }

  loadProduct(){
    let dataItem = this.props.homeCategory.productList['p'+this.props.parent][this.props.rowNum];
    this.image = global.storeMediaURL + 'catalog/product' + dataItem.custom_attributes.thumbnailv2;

    // if(!dataItem.configurable){
    //   this.state.initTotal++;
    //   this.props.fetchData({
    //     start:'FETCHING_PRODUCT_configurable_START',
    //     next:'FETCHING_PRODUCT_configurable_SUCCESS',
    //     rejected:'FETCHING_PRODUCT_configurable_ERROR',
    //     method:'POST',
    //     url:'products/configurable/'+dataItem.sku,
    //     data:{'language_id': lang,},
    //     callback:(data)=>this.onInit(data, "configurable")
    //   });
    // }
    
    // this.state.initTotal++;
    //   this.props.fetchData({
    //     start:'FETCHING_PRODUCT_configurable_START',
    //     next:'FETCHING_PRODUCT_configurable_SUCCESS',
    //     rejected:'FETCHING_PRODUCT_configurable_ERROR',
    //     method:'POST',
    //     url:'products/configurable/'+dataItem.sku,
    //     data:{'language_id': lang,},
    //     callback:(data)=>this.onInit(data, "configurable")
    //   });

    // setTimeout(() => {
      // this.getImgAndStock(dataItem.sku);
      // this.checkStockStatus(dataItem.sku);
    // }, 100 * this.props.rowNum + 50 * this.props.index);
    
    
  }

  getImgAndStock(sku){
    this.state.initTotal++;
    global.InitData++;
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchData({
        start:'FETCHING_PRODUCT_getImgAndStock_START',
        next:'FETCHING_PRODUCT_getImgAndStock_SUCCESS',
        rejected:'FETCHING_PRODUCT_getImgAndStock_ERROR',
        method:'POST',
        url:'products/getImgAndStock/'+sku,
        data:{'lang': lang,},
        callback:(data)=>this.onInit(data, "getImgAndStock")
      });
    })
  }

  // checkStockStatus(sku){
  //   this.state.initTotal++;
  //   this.props.fetchData({
  //     start:'FETCHING_PRODUCT_stockStatuses_START',
  //     next:'FETCHING_PRODUCT_stockStatuses_SUCCESS',
  //     rejected:'FETCHING_PRODUCT_stockStatuses_ERROR',
  //     method:'POST',
  //     url:'products/stockQty/'+sku,
  //     data:{'language_id': lang,},
  //     callback:(data)=>this.onInit(data, "stockStatuses")
  //   });
  // }

  onInit(data, type){
    this.state.initCount++;
    global.InitDataCount++;
    switch (type) {
      // case "configurable":
      //   if(typeof(data.data)=="object" && data.data != null && data.data.length > 0){
      //     for (let i = 0; i < data.data.length; i++) {
      //       let attributes = {};
      //       this.checkStockStatus(data.data[i].sku);
      //       data.data[i].custom_attributes.forEach(attribute => {
      //         attributes[attribute.attribute_code] = attribute.value;
      //       });
      //       data.data[i].custom_attributes = attributes;
      //     }
      //     this.state.initData[type] = data.data;
      //     this.props.homeCategory.productList['p'+this.props.parent][this.props.rowNum]['configurable'] = data.data;
      //   }
      //   break;
      case "getImgAndStock":
        if(data.image && data.image.image){
          this.image = data.image.image;
        }else{
          let dataItem = this.props.homeCategory.productList['p'+this.props.parent][this.props.rowNum];
          this.image = global.storeMediaURL + 'catalog/product' + dataItem.custom_attributes.small_image;
        }
        if(data.stock && data.stock.stock_status > 0){
          this.state.stockStatus = this.state.stockStatus + 1;
        }
        break;
      case "stockStatuses":
        if(typeof(data.data)=="object" && data.data != null){
          if(data.data.stock_status && data.data.stock_status > 0){
            this.state.stockStatus = this.state.stockStatus + 1;
          }
        }
        break;

      default:
        break;
    }
    
    
    if(this.state.initCount >= this.state.initTotal){
      if(this.state.stockStatus==0){
        this.setState({
          outStock:true
        })
      }else{
        this.setState({
          onLoading:false
        })
      }
      
    }
  }

  /*
    _renderPrice(price, sprice, from, to, type_id){
      let dataItem = this.props.homeCategory.productList['p'+this.props.parent][this.props.rowNum];
      let upStr = '';
      let sprice_on = true;
      sprice = parseFloat(sprice);

      // var dateNow = 0;//clock.getTime();
      if(dataItem.configurable && dataItem.configurable.length>0){
        sprice_on = false;
        let tmp_sprice = 99999999;
        let tmp_price = 99999999;
        dataItem.configurable.forEach(data => {
          
          let tmp_from = data.custom_attributes.special_from_date;
          let tmp_to = data.custom_attributes.special_to_date;

          if(data.price<tmp_price){
            tmp_price = data.price;
          }

          if(tmp_from && tmp_to){
            if(moment.parseZone(tmp_from.replace(" ","T") + "+08:00").utc().valueOf() < this.props.dateNow && moment.parseZone(tmp_to.replace(" ","T") + "+08:00").utc().valueOf() > this.props.dateNow){
              sprice_on = true;
              if(data.custom_attributes.special_price < tmp_sprice){
                tmp_sprice = data.custom_attributes.special_price;
              }
            }
          }else{
            if(tmp_from && moment.parseZone(tmp_from.replace(" ","T") + "+08:00").utc().valueOf() < this.props.dateNow){
              sprice_on = true;
              if(data.custom_attributes.special_price < tmp_sprice){
                tmp_sprice = data.custom_attributes.special_price;
              }
            }
        
            if(tmp_to && moment.parseZone(tmp_to.replace(" ","T") + "+08:00").utc().valueOf() > this.props.dateNow){
              sprice_on = true;
              if(data.custom_attributes.special_price < tmp_sprice){
                tmp_sprice = data.custom_attributes.special_price;
                
              }
            }
          }
        });
        price = tmp_price;
        sprice = parseFloat(tmp_sprice);
        upStr = "+";
      }else{
        if(from && moment.parseZone(from.replace(" ","T") + "+08:00").utc().valueOf() > this.props.dateNow){
          sprice_on = false;
        }
    
        if(to && moment.parseZone(to.replace(" ","T") + "+08:00").utc().valueOf() < this.props.dateNow){
          sprice_on = false;
        }
      }
      
      if(type_id=="configurable")
        upStr = "+";
      
      if(sprice > 0 && sprice_on){
        return (
          <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:16, color:global.colors.text.a1}}>$</Text>
            <View>
              <Text style={{ textDecorationLine:'line-through',color:'#ccc', fontSize:12 * (global.scale==0.77?0.85:global.scale), alignSelf:'center', justifyContent:'center' }}>{ parseFloat(price).toFixed(2) }</Text>
              <Text style={{marginTop:-4, fontSize:14, color:global.colors.text.a1}}>{ global.NumberFormat(parseFloat(sprice).toFixed(2)) + upStr }</Text>
            </View>
          </View>
        )
      }else if(price >0){
        return (
          <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:16, color:global.colors.text.a1}}>$</Text>
            <Text style={{color:global.colors.text.a1}}>{ global.NumberFormat(parseFloat(price).toFixed(2)) + upStr }</Text>
          </View>
        )
      }else{
        return null
      }
    }
  */
  

  _renderHomeProduct(item,index) {
    
  }

  render() { 
    let index = this.props.index;
    let dataItem = this.props.homeCategory.productList['p'+this.props.parent][this.props.rowNum];
    if(this.state.outStock){
      return(
        <View/>
      )
    }else{
      let in_stock = true;
      if(dataItem.extension_attributes && dataItem.extension_attributes.stock_item){
        in_stock = dataItem.extension_attributes.stock_item.is_in_stock;
      }
      if(index % 3 == 0){
        this.renderLongWidth = true;
        return (
          <View style={{flex:1,margin:4, marginLeft:10, marginRight:0, minHeight:120}}>
            <Card style={{flex:1,backgroundColor:global.colors.background.root, borderRadius:10, overflow:'hidden', width: win.width - (win.width * 0.25)}}>
              <TouchableOpacity 
                onPress={() => Actions.ProductView({
                  // parent:this.props.parent, 
                    // rowNum:this.props.rowNum,
                    // dateNow:this.props.dateNow,
                    // listSet:"homeCategory",
                    product:dataItem
                  }
                )}
                style={{flex:1,flexDirection:'row'}}
                >
                {/* <Image source={{ uri:global.storeMediaURL + 'catalog/product' + dataItem.custom_attributes.small_image}} style={{ width:120, height:120, resizeMode:'cover'}} /> */}
                <View>
                  <ImageLoaderBase64
                        style={{ width:110, height:'100%'}}
                        imageStyle={{ width:'100%', height:'100%', resizeMode:'cover'}}
                        loadingStyle={{ size: 'large', color: 'blue' }}
                        placeholderSource={require('../images/empty-image.png')}
                        source={this.image}
                    />
                  {
                    in_stock == false?
                    <View style={{width:'100%', backgroundColor:"#0006", position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                      <Text style={{color:'#def', margin:3}}>{I18n.t('Sold Out')}</Text>
                    </View>
                    :null
                  }
                </View>
                <View style={{flex:1, margin:5}}>
                  <Text numberOfLines={3} ellipsizeMode='tail' style={{flex:1, marginTop:2, overflow:'hidden', fontSize:16 * global.scale, }}>{dataItem.name}</Text>
                  {this.state.onLoading?
                    <View style={[styles.container]}>
                      <ActivityIndicator size="small" color={global.colors.background.statusBar} />
                    </View>
                    :
                    <View style={{flexDirection:'row'}}>
                      <RenderPrice
                        uFontSize={12}
                        fontSize={18 * global.scale}
                        style={{width:'100%'}}
                        price={dataItem.price}
                        sprice={dataItem.custom_attributes.special_price}
                        from={dataItem.custom_attributes.special_from_date}
                        to={dataItem.custom_attributes.special_to_date}
                        dateNow={this.props.dateNow}
                      />
                      {
                        dataItem.type_id=="configurable"
                        ?
                        <Text>+</Text>
                        :
                        null
                      }
                    </View>
                    
                  }
                  {/* this._renderPrice(dataItem.price, dataItem.custom_attributes.special_price, dataItem.custom_attributes.special_from_date, dataItem.custom_attributes.special_to_date, dataItem.type_id)  */}
                </View>
                {/* { index == 0?
                  <ImageBackground source={require('../images/rank_tag.png')} style={{width:22, height:24, position:'absolute', top:0, left:10, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:global.colors.text.t1, fontSize:16, marginTop:-5}}>{this.props.index+1}</Text>
                  </ImageBackground>
                  :null */
                }
              </TouchableOpacity>
            </Card>
          </View>
        )
      }else{
        this.renderLongWidth = false;
        return(
          <View style={{flex:1,margin:3, marginLeft:5, marginRight:0, minHeight:140}}>
            <Card style={{flex:1,backgroundColor:global.colors.background.root, borderRadius:10, overflow:'hidden', width:120}}>
             
              <TouchableOpacity 
                  onPress={() => Actions.ProductView({
                    // parent:this.props.parent, 
                    // rowNum:this.props.rowNum,
                    // dateNow:this.props.dateNow,
                    // listSet:"homeCategory",
                    product:dataItem
                    }
                  )}
                  style={{flex:1}}
                  >
                  <View>
                    <ImageLoaderBase64
                        style={{ width:'100%', height:110}}
                        imageStyle={{ width:'100%', height:'100%', resizeMode:'cover'}}
                        loadingStyle={{ size: 'large', color: 'blue' }}
                        placeholderSource={require('../images/empty-image.png')}
                        source={this.image}
                    />
                    {
                      in_stock == false?
                      <View style={{width:'100%', backgroundColor:"#0006", position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'#def', margin:3}}>{I18n.t('Sold Out')}</Text>
                      </View>
                      :null
                    }
                  </View>
                  <View style={{flex:1, margin:5}}>
                    <Text numberOfLines={3} ellipsizeMode='tail' style={{flex:1, marginTop:2, overflow:'hidden', fontSize:16 * global.scale, }}>{dataItem.name}</Text>
                    {this.state.onLoading?
                      <View style={styles.container}>
                        <ActivityIndicator size="small" color={global.colors.background.statusBar} />
                      </View>
                      : 
                      <View style={{width:'100%',flexDirection:'row', alignItems:'flex-end'}}>
                        <RenderPrice
                          uFontSize={12}
                          fontSize={18 * global.scale}
                          style={{width:'100%'}}
                          price={dataItem.price}
                          sprice={dataItem.custom_attributes.special_price}
                          from={dataItem.custom_attributes.special_from_date}
                          to={dataItem.custom_attributes.special_to_date}
                          dateNow={this.props.dateNow}
                        />
                        {
                          dataItem.type_id=="configurable"
                          ?
                          <Text>+</Text>
                          :
                          null
                        }
                      </View>
                    }
                    {/* this._renderPrice(dataItem.price, dataItem.custom_attributes.special_price, dataItem.custom_attributes.special_from_date, dataItem.custom_attributes.special_to_date, dataItem.type_id)  */}
                    { /*
                      this._renderPrice(this.props.item)
                      */
                    }
                  </View>
                  { index == 0?
                    <ImageBackground source={require('../images/rank_tag.png')} style={{width:22, height:24, position:'absolute', top:0, left:10, justifyContent:'center', alignItems:'center'}}>
                      <Text style={{color:global.colors.text.t1, fontSize:16, marginTop:-5}}>{dataItem.index+1}</Text>
                    </ImageBackground>
                    :null
                  }
                </TouchableOpacity>
            </Card>
          </View>
        )
      }
    }
  }
}
 
const mapStateToProps = ({ homeCategory }) => ({ homeCategory });
export default connect( mapStateToProps, { fetchData })(ProductRect);