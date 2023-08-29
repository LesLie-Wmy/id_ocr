import React, { Component } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet
} from 'react-native';
import {
  Icon,
  CardItem,
  Card,
  Left,
  Body,
  Right
} from 'native-base'
import { connect } from 'react-redux'
import { amendItems, removeItems, } from '../actions/shoppingCart'
import Image from "./ResponsiveImage";
const win = Dimensions.get("window");

export class CartList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _addItems(keys, values){
    this.props.amendItems({item:this.props.data.item, keys:keys, values:values, addItems:1})
  }

  _subtractItems(keys, values){
    if(this.props.shoppingCart.productList["k"+this.props.data.item.product_id].itemTotalQuantity < 2){
      this._removeProduct()
    }else{
      this.props.amendItems({item:this.props.data.item, keys:keys, values:values, subtractItems:1})
    }
  }

  _removeProduct(){
    Alert.alert(
      'Remove Product',
      'Remove \"' + this.props.data.item.productName + "\" ?" ,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.props.removeItems({item:this.props.data.item})},
      ],
      {cancelable: false},
    );
  }

  _renderEdit(){
    if(this.props.editCartList.isEdit){
      return(
        <View style={{ flexDirection:'row', borderTopWidth:1, borderColor:'lightgrey', marginLeft:10, marginRight:10}}>
          <TouchableOpacity onPress={ () => this._removeProduct()} style={{ flex:1,flexDirection:'row', justifyContent:'center', alignItems:'center', borderRightWidth:0 }}>
            <Icon type='Octicons' name="trashcan" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, marginTop:5}}/>
          </TouchableOpacity>   
         
        </View>
      )
    }else{
      return(
        <View/>
      )
    }
  }

  _numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  _renderPriceList(){
    let arr = []
    if(this.props.shoppingCart.productList["k"+this.props.data.item.product_id]['CartList']){
      Object.entries(this.props.shoppingCart.productList["k"+this.props.data.item.product_id]['CartList']).forEach( entry => {
        let keys = entry[0];
        let values = entry[1];
        arr.push(
        <View style={{ flexDirection:'row', borderWidth:0, justifyContent:'space-around', alignItems:'center'}}>
          { values.itemPoints > 0 ? <Icon type='Octicons' name="ruby" style={{fontSize: 22, color: global.styles.ruby, marginRight:5}}/> : null }
          <Text style={{ fontSize:16, marginRight:10 }}>{ values.itemPoints > 0 ? values.itemPoints : null }</Text>
          { values.itemPrice > 0 ? <Icon type='FontAwesome' name="money" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, }}/> : null }
          <Text style={{ fontSize:16 }}>{ values.itemPrice > 0 ? global.NumberFormat(parseFloat(values.itemPrice).toFixed(2)) : null}</Text>
            <View style={{ flex:1,justifyContent:'flex-end', alignItems:'flex-end', flexDirection:'row'}}>
              <TouchableOpacity onPress={ () => this._subtractItems(keys,values)}>
                <Icon type='MaterialCommunityIcons' name="minus-circle-outline" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, marginTop:5}}/>  
              </TouchableOpacity>
              <View style={{ width:50, justifyContent:'center', alignItems:'center'}}>
                <Text style={{ fontSize:16 }}>{ values.itemQuantity }</Text>
              </View>
              <TouchableOpacity onPress={ () => this._addItems(keys,values)}>
                <Icon type='MaterialIcons' name="add-circle-outline" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, marginTop:5}}/>  
              </TouchableOpacity>
            </View>
        </View>
      )
      })
    }else{
      return (
        <View/>
      );
    }
    return arr
  }

  render() {
    return (
      <Card>
        <CardItem>
          <Body>
            <View>
              <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'lightgrey', }}>
                <Image source={global.hostURL+'image/' + this.props.data.item.image} style={{ width:win.width /1.2, height:120, resizeMode:'contain',borderWidth:0}}/>
              </View>
              <View style={{ borderWidth:0, }}>
                <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', borderWidth:0 }}>
                  <Left></Left>
                  <Body style={{ flex:2, borderWidth:0, }}>
                    <Text style={{ fontWeight:'600', fontSize:18, width:200}}>{this.props.data.item.productName}</Text>
                  </Body>
                  <Right>
                  <TouchableOpacity onPress={ () => this._removeProduct()} style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', borderRightWidth:0 }}>
                    <Icon type='Octicons' name="trashcan" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, marginTop:5}}/>
                  </TouchableOpacity>  
                  </Right>
                  
                </View>
                <View style={{  borderWidth:0, marginBottom:8}}>
                  <Text style={{ fontWeight:'400', fontSize:18,color:'lightgrey',}}>{this.props.data.item.name}</Text>
                </View>
                <View style={{ justifyContent:'center', alignItems:'center', borderWidth:0}}>
                  {
                    this._renderPriceList()
                  }
                </View>
              </View>
            </View>
            <View style={ styles.separator }/>
            <View>
              <Text style={{ color:'lightgrey', fontSize:20 }}>SubTotal</Text>
            </View>
            <View style={{ flexDirection:'row', paddingTop:5, justifyContent:'space-around', alignItems:'center' }}>
              <Icon type='Octicons' name="ruby" style={{fontSize: 22, color: global.styles.ruby, marginRight:5}}/>
              <Text style={{ fontSize:16, marginRight:10 }}>{ global.NumberFormat(parseFloat(this.props.shoppingCart.productList["k"+this.props.data.item.product_id]['itemPointsSubTotal'])) }</Text>
              <Icon type='FontAwesome' name="money" style={{fontSize: 22, color: global.styles.ruby, marginRight:5, }}/>
              <Text style={{ fontSize:16 }}>{ global.NumberFormat(parseFloat(this.props.shoppingCart.productList["k"+this.props.data.item.product_id]['itemPriceSubTotal']).toFixed(2)) }</Text>
            </View>
        </Body>
      </CardItem>
    </Card>
      
    );
  }
}

const styles = StyleSheet.create({
  separator:{
    height:10,
    width: '100%',
    backgroundColor:'white',
    borderBottomWidth:.5,
    borderColor:'lightgrey'
  },
})

const mapStateToProps = ({ editCartList, shoppingCart, }) => ({ editCartList, shoppingCart, })
export default connect(mapStateToProps, { amendItems, removeItems })(CartList)