import React, { Component } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  Image as RNImage,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  Card
} from 'native-base'
import { Actions } from 'react-native-router-flux'
import Image from './ResponsiveImage';
import CornerLabel from '../libs/react-native-smart-corner-label'
import I18n from '../langs' 
import Banner from './Banner'
import { interfaceDeclaration } from '@babel/types';

const win = Dimensions.get("window")
export default class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : this.props.data.item
    };
    this.renderLongWidth = true;
  }

  _getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  _removeEncodedHTML(x){
    x = x.replace(/&lt;(.|\n)*?gt;/g, '');
    return x;
  }

  _renderSPoints(spoints, points){
    if(spoints){
      return (
        <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <RNImage source={require('../images/icon_sign_point.png')}  style={{width:15*1.5, height:14*1.5, marginRight:3, resizeMode:"stretch"}} />
          <View>
            <Text style={{ textDecorationLine:'line-through',color:'#ccc', fontSize:12 * (global.scale==0.77?0.85:global.scale), alignSelf:'center', justifyContent:'center' }}>{ points }</Text>
            <Text style={{marginTop:-4, color:global.colors.text.a1}}>{ global.NumberFormat(spoints) }</Text>          
          </View>
        </View>
      )
    }else{
      return null
    }
  }
  _renderNPoints(points){
    if(points > 0){
      return (
        <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          {/* <Icon type='Octicons' name="ruby" style={{fontSize: 22, color: global.styles.ruby, marginRight:3, width:25}}/> */}
          <RNImage source={require('../images/icon_sign_point.png')}  style={{width:20, height:19, marginRight:3, resizeMode:"stretch"}} />
          <Text style={{color:global.colors.text.a1}}>{ global.NumberFormat(points) }</Text>
        </View> 
      )
    }else{
      return null
    }
  }
  _renderSPrice(sprice, price){
    if(sprice > 0){
      return (
        <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          {/* <Icon type='FontAwesome' name="money" style={{fontSize: 22, color: global.styles.ruby, marginRight:3, width:25}}/> */}
          <Text style={{fontSize:16, color:global.colors.text.a1}}>HK$</Text>
          <View>
            <Text style={{ textDecorationLine:'line-through',color:'#ccc', fontSize:12 * (global.scale==0.77?0.85:global.scale), alignSelf:'center', justifyContent:'center' }}>{ parseFloat(price).toFixed(2) }</Text>
            <Text style={{marginTop:-4, color:global.colors.text.a1}}>{ global.NumberFormat(parseFloat(sprice).toFixed(2)) }</Text>
          </View>
        </View>
      )
    }else{
      return null
    }
  }

  _renderNPrice(price){
    if(price >0){
      return (
        <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          {/* <Icon type='FontAwesome' name="money" style={{fontSize: 22, color: global.styles.ruby, marginRight:3, width:25}}/> */}
          <Text style={{fontSize:16, color:global.colors.text.a1}}>HK$</Text>
          <Text style={{color:global.colors.text.a1}}>{ global.NumberFormat(parseFloat(price).toFixed(2)) }</Text>
        </View>
      )
    }else{
      return null
    }
  }

  _renderPrice(item){
    let spoints
    let sprice
    let points
    let price
    if(item.options && item.options.length > 0){
      console.log(item.options)
      item.options[0].product_option_value.forEach( product_option_value => {
        if(product_option_value.key == 'price'){
          price = product_option_value.value
        }else if(product_option_value.key == 'sprice'){
          sprice = product_option_value.value
        }else if(product_option_value.key == 'points'){
          points = product_option_value.value
        }else if(product_option_value.key == 'spoints'){
          spoints = product_option_value.value
        }
      })
      return (
        <View style={{ flex:1, margin:4, flexDirection:this.renderLongWidth?'row-reverse':'column-reverse', marginTop:5, justifyContent:'center', alignItems:'center'}}>
            { spoints ? this._renderSPoints(spoints, points) : this._renderNPoints(points) }
            { sprice ? this._renderSPrice(sprice, price) : this._renderNPrice(price) }
        </View>
      );
    }else{
      return (<View/>)
    }
  }

  _renderShopListItem(data){
    return( 
      <Card style={{ overflow: 'hidden', //don't forget to set this
                      width: win.width / 1.7,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: '#eee',
                      margin: 3,
                      borderRadius:10,
                      marginRight:5,
                      }}>
          <View style={{ flex:1,  borderRadius:10 }}>
            <TouchableOpacity 
              onPress={() => Actions.ProductDetail({item:data.item})} 
              style={{borderWidth:0, margin:0, flexDirection:'row'}}>
              <Image source={global.hostURL+'image/' + data.item.image} style={{  width:110, height:110, resizeMode:'contain', borderRadius:5}}/>
            
              <Text style={{flex:1, margin:3}}>{data.item.productName}</Text>
            </TouchableOpacity>
            {this._renderPrice(data.item)}
          </View>

          
        {/* <CornerLabel
          cornerRadius={54}
          alignment={'right'}
          style={{backgroundColor: 'lightgreen', height: 24,}}
          textStyle={{color: '#000', fontSize: 12,}}>
          { parseFloat(Math.random() * (70 - 30 + 1) + 30).toFixed(0) + '%off'}
        </CornerLabel> */}
      </Card>
    ) 
  }
  
  render() {
    console.log(this.props)
    let len = 1
    if(this.props.data.hotpick_item.length%2==0){
      len = 2;
    }else if(this.props.data.hotpick_item.length%3==0){
      len = 3;
    }
    return (
      <View style={{backgroundColor:global.colors.background.homeProductRow, paddingTop:20}}>
        {
          this.props.data.image?
          <View style={{backgroundColor:global.colors.background.homeProductRow}}>
            <Banner 
              // containerStyle={{ width:win.width - 12, borderWidth:0, borderRadius:0 }} 
              // style={{ borderWidth:0, height:180,  borderRadius:0, resizeMode:'contain' }} 
              containerStyle={{margin:0, borderRadius:0}} 
              resizeMode='cover' 
              style={{borderRadius:0, width:"100%", height:200}}
              banner={global.hostURL+'image/' + this.props.data.image}/>  
          </View>:
          null
        }
        
        <View style={{ backgroundColor:global.colors.background.root, padding:2, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderLeftColor:global.colors.border.homeProductRow, borderLeftWidth:6}}>
          <View>
            <View style={{ marginLeft:10 }}>
              <Text style={{ fontSize:20, fontWeight:'bold', color:global.colors.text.d1,}}>{ this.props.data.name }</Text>
              <Text style={{ fontSize:16, color:global.colors.text.t2,}}>{ this._removeEncodedHTML(this.props.data.description)}</Text>        
            </View>
          </View>
          <TouchableOpacity onPress={ () => Actions.ShopIndex({category_id:this.props.data.category_id, shop_name:this.props.data.name})}>
            <RNImage source={require('../images/btn_more.png')} style={{widtd:45, height:39, marginRight:10}} />
          </TouchableOpacity>
        </View> 
        <ScrollView
          horizontal={true}
          
          >
          <FlatList
            // style={{ justifyContent:'space-evenly', alignItems:'center' }}
            scrollEnabled={false}
            style={{padding:7, paddingRight:2}}
            // contentContainerStyle={styles.list_container}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            numColumns={ this.props.data.hotpick_item.length / len}
            data={ this.props.data.hotpick_item}
            renderItem={ (data) => this._renderShopListItem(data) }
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list_container:{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flexWrap:'wrap',
    paddingHorizontal: "4%",
    borderWidth:0,
    borderRadius:14
  }
})



