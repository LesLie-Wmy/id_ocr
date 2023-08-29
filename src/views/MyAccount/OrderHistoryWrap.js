//import libraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
} from 'native-base'
import { Actions, ActionConst } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { fetchData } from '../../actions/fetch';
import I18n from '../../langs';
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import {LoadingWithoutModal as Loading} from '../../component/LoadingWithoutModal';


import ImageBySku from '../../component/ImageBySku';

var dateFormat = require('dateformat');

// create a component
const Status = [
  "",
  "Pending Payment",
  "Processing",
  "Shipped",
  "",
  'Complete',
  "",
  'Canceled',
  'Denied',
  'Canceled Reversal',
  'Failed',
  'Refunded',
  'Reversed',
  'pending',
];

var total = {price:0, points:0};
class OrderHistoryWrap extends Component {
  constructor(props){
    super(props);
    this.state={
      filter_visible:false,
      filter_type:undefined,
      filter_status:undefined,
      filter_from:undefined,
      filter_from_visible:false,
      filter_to:undefined,
      filter_to_min:undefined,
      filter_to_visible:false,
      isLoading:true
    }

    this.filter_status_data = [];
    for (let index = 0; index < Status.length; index++) {
      if(Status[index]!=""){
        this.filter_status_data.push({
          value: I18n.t(Status[index]),
          id:index
        })
      }
    }

    this.dateForStart = new Date();
    this.dateForStart.setDate(this.dateForStart.getDate());
    this.dateForStart.setHours(0);
    this.dateForStart.setMinutes(0);
    this.dateForStart.setSeconds(0);
    this.dateForStart.getMilliseconds(0);
  }

  componentDidMount(){
    this.onLoadData();
  }

  onLoadData(){
    this.props.fetchData({
      next:'FETCH_ORDER_HISTORY_SUCCESS', 
      rejected:'FETCH_ORDER_HISTORY_ERROR', 
      method:'POST',
      url:'orders/history', 
      data:{
        'token':this.props.user.user.token,
        'tokenExpired':this.props.user.user.tokenExpired,
        "lang": I18n.currentLocale(),
        "page": 1,
        "size": 20,
      },
      callback:(data, isError)=>{
        this.setState({isLoading:false})
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 200);
        }
      }
    });
  }

  render() {
    if(this.state.isLoading){
      return (
        <Container style={{flex:1, backgroundColor:global.colors.background.statusBar}}>
          <Statusbar backgroundColor={global.colors.background.statusBar}/>
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              title={I18n.t('OrderHistory')}
              titleColor={global.colors.text.t1}
              renderLeft={
                <TouchableOpacity transparent style={{paddingLeft:10, paddingRight:10}} onPress={() => this.state.onPayment?Actions.pop({ refresh: {onChangeAddressBack:true}, timeout: 10}):Actions.pop()}>
                  <Icon name="ios-arrow-back" style={{fontSize:30,color:global.colors.text.t1}} />
                </TouchableOpacity>
              }
            />
          </View>
          <Loading style={{backgroundColor:'#fff', height:'100%' }} Color='#3c3c42' textColor='#333' ref="Loading" isShow={true} text={I18n.t('Loading')} />
        </Container>
      )
    }else{
      return (
        <View>
          
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader 
            title={I18n.t('OrderHistory')}
            titleColor={global.colors.text.t1}
            renderRight={
            <TouchableOpacity onPress={()=>{this.flatListRef.scrollToOffset({ animated: true, offset: 0 });this.setState({filter_visible:true})}}>
              <Icon type='AntDesign' name='filter' style={{fontSize:28, color:global.colors.text.t1, marginRight:10}} />
            </TouchableOpacity>}
          />
        </View> 
        {
          this.props.orderHistory.list > 0
          ?
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            style={{ backgroundColor:global.styles.body}}
            data={this.props.orderHistory.list}
            contentContainerStyle={{paddingBottom:80, marginBottom:20}}
            renderItem={({item,index})=>this.renderItem({item,index})}
            onScroll={event => { 
              this.yOffset = event.nativeEvent.contentOffset.y;
              console.log("onScroll",this.yOffset);
            }}
            onScrollEndDrag={event => { 
              this.yOffset = event.nativeEvent.contentOffset.y;
              console.log("onScrollEndDrag",this.yOffset);
            }}
            />
          :
          <View style={{height:'100%', width:'100%', alignItems:'center', marginTop:10}}>
            <Text style={{color:global.colors.text.t2}}>-- {I18n.t("No Record Found")} --</Text>
          </View>
        }
        
        </View>

         
      );
    }
  }

  renderFilter(){
    return(
      <View style={{borderColor:global.styles.textLight3, backgroundColor:global.styles.bodyLight, borderRadius:10, margin:15, marginBottom:10, marginTop:5, borderWidth:1, overflow:'hidden', flex:1, alignItems:'center', justifyContent:'center', width:'94%'}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Dropdown
                  placeholder={I18n.t("Type")}
                  labelFontSize={0}
                  labelHeight={0}
                  dropdownOffset={{top: 100}}
                  fontSize={20* global.scale}
                  style={{textAlign:'center'}}
                  containerStyle={{backgroundColor: global.styles.bodyLight, margin: 0, padding: 0, width:"90%"}}
                  ref={dropdown => this.dropdown = dropdown}
                  onChangeText={(value, index, data)=>this.setState({filter_type:index})}
                  data={[
                    {
                      value: I18n.t("Product"),
                      id:1
                    }, {
                      value: I18n.t("Sim"),
                      id:2
                    }, {
                      value: I18n.t("Gift"),
                      id:3
                    }
                  ]}
                />
              </View>
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Dropdown
                  placeholder={I18n.t("Status")}
                  labelFontSize={0}
                  labelHeight={0}
                  dropdownOffset={{top: 100}}
                  fontSize={20* global.scale}
                  style={{textAlign:'center'}}
                  containerStyle={{backgroundColor: global.styles.bodyLight, margin: 0, padding: 0, width:"90%"}}
                  ref={dropdown => this.dropdown = dropdown}
                  onChangeText={(value, index, data)=>this.setState({filter_type:index})}
                  data={this.filter_status_data}
                />
              </View>
            </View>
            <View style={{flexDirection:'row', marginLeft:10, marginRight:10,marginBottom:5}}>
              <Text style={{fontSize:20* global.scale, color:global.styles.textLight3}}>{I18n.t('Date:')}</Text>
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>this.setState({filter_from_visible:true})} >
                  <Text style={{fontSize:20* global.scale}}>{this.state.filter_from||I18n.t('From')}</Text>
                </TouchableOpacity>
                <DateTimePicker
                  date={this.dateForStart}
                  maximumDate={this.dateForStart}
                  isVisible={this.state.filter_from_visible}
                  onConfirm={(data)=>{
                    console.log(dateFormat(data, 'yyyy-mm-dd'));
                    this.setState({filter_to_min:data, filter_from:dateFormat(data, 'yyyy-mm-dd'),filter_from_visible:false})
                    }}
                  onCancel={()=>this.setState({filter_from_visible:false})}
                />
              </View>

              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>this.setState({filter_to_visible:true})}>
                  <Text style={{fontSize:20* global.scale}}>{this.state.filter_to||I18n.t('To')}</Text>
                </TouchableOpacity>
                <DateTimePicker
                  date={this.dateForStart}
                  minimumDate={this.state.filter_to_min||undefined}
                  maximumDate={this.dateForStart}
                  isVisible={this.state.filter_to_visible}
                  onConfirm={(data)=>{
                    console.log(dateFormat(data, 'yyyy-mm-dd'));
                    this.setState({filter_to:dateFormat(data, 'yyyy-mm-dd'),filter_to_visible:false})
                    }}
                  onCancel={()=>this.setState({filter_to_visible:false})}
                />
              </View>
            </View>
            <View style={{flex:1,flexDirection:'row'}}>
              <TouchableOpacity 
                style={{flex:1,alignItems:'center', justifyContent:'center', borderTopColor:global.styles.textLight3,borderTopWidth:0.8, padding:5, backgroundColor:global.styles.card}}
                onPress={()=>this.setState({
                  filter_visible:false,
                  filter_visible:false,
                  filter_type:undefined,
                  filter_status:undefined,
                  filter_from:undefined,
                  filter_from_visible:false,
                  filter_to:undefined,
                  filter_to_min:undefined,
                  })}>
                <Icon type='MaterialCommunityIcons' name='filter-remove-outline' style={{color:global.styles.btn, fontSize:30* global.scale}} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={{flex:1,alignItems:'center', justifyContent:'center', borderTopColor:global.styles.textLight3,borderTopWidth:0.8, padding:5, backgroundColor:global.styles.card, borderLeftWidth:0.5}}
                onPress={()=>this.setState({
                  })}>
                <Icon type='AntDesign' name='filter' style={{color:global.styles.btn, fontSize:30* global.scale}} />
              </TouchableOpacity>
            </View>
            
          </View>
    )
  }

  renderItem({item,index}){
    total = {price:0, points:0};
    return(
      <View style={{flex:1, alignItems:'center', justifyContent:'center', width:'100%'}}>
        {index==0 && this.state.filter_visible?this.renderFilter():null}
          <Card style={styles.row}>
          <View style={styles.headerRow}>
          
            <Text style={styles.LabelStatus}>{I18n.t("Order_id:")}</Text>
            <Text style={[styles.TxtStatus,{flex:1}]}>{item.increment_id}</Text>

            <Text style={styles.LabelStatus}>{I18n.t("Status:")}</Text>
            <Text style={[styles.TxtStatus]}>{I18n.t(item.status, {defaultValue: item.status})}</Text>

          </View>
          {this.render_products(item.items)}
          <View style={{flex:1, margin:5, marginLeft:10, marginRight:10,justifyContent: "center"}}>
            <View style={{flex:1, flexDirection:'row'}}>
              <Text style={[styles.LabelStatus, {flex:1}]}>{I18n.t("Date:")}<Text style={styles.TxtStatus}>{item.created_at.substr(0,16)}</Text></Text>
              <Text style={[styles.LabelStatus,{marginRight:5}]}>{item.items.length > 1?I18n.t('Total %{num} items',{num:item.items.length}):I18n.t('Total 1 item')}</Text>
            </View>
            <View style={{marginRight:5, alignItems:'flex-end'}}>
              
              <View style={{flexDirection:'row', marginLeft:10}}> 
                <Text style={styles.LabelStatus}>{I18n.t('Total')}:</Text>
                <Text  style={styles.TxtStatus}> ${global.NumberFormat(item.grand_total)}</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    )
  }

  render_products(products){
   return products.map((product,index)=>{
     total.price += product.price;
     total.points += product.points;
      return(
        <View style={{flexDirection:'row',flex:1, margin:10, marginBottom:0, borderRadius:10, overflow:'hidden', backgroundColor:global.styles.textLight4, borderColor:global.colors.background.statusBar, borderWidth:0.5}}>
          <View>
            <View>
              <ImageBySku
                sku={product.sku}
                imageStyle={{width:100 * global.scale,height:100*global.scale}}
                placeholderStyle={{width:100 * global.scale,height:100*global.scale}}
                resizeMode='cover'
              />
              {product.type==3?
              <View style={{width:50 * global.scale,height:50*global.scale, position:'absolute', bottom:0, right:0}}>
                <View style={styles.triangle} />
                <Icon type='Octicons' name="gift" style={{position:'absolute', bottom:0, right:2, fontSize: 26* global.scale, color: global.styles.bodyLight}} />
              </View>:null
              }
            </View>
            
          </View>
          <View style={{flex:1, marginTop:5, alignItems:'flex-start', justifyContent:'flex-start'}}>
            <Text numberOfLines={4} ellipsizeMode="tail" style={styles.productName}>{product.name}</Text>
          </View>
          <View style={{alignItems:'center', flexDirection:'row', justifyContent:'center', marginRight:10, marginLeft:5}}>
            <Text style={[{fontSize:16 * global.scale, color:global.styles.textLight2,}]}>${global.NumberFormat(product.row_total)}</Text>
            <Text style={[{fontSize:16 * global.scale, color:global.styles.textLight2,}]}> x{product.qty_ordered}</Text>
          </View>
        </View>
      )
    })
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row:{
    width:'94%',
    backgroundColor: global.styles.bodyLight,
    margin:15 * global.scale,
    marginTop:5 * global.scale,
    borderColor: global.styles.textLight4,
    borderWidth:1,
    borderRadius: 10,
  },
  headerRow:{
    flexDirection:'row', 
    flex:1, 
    marginLeft:10 * global.scale,
    marginRight:10 * global.scale,
    marginTop:10 * global.scale,
    alignItems:'center',
    justifyContent: "center"
  },
  LabelStatus:{
    color: global.colors.text.d2,
    fontSize: 15 * global.scale,
    fontWeight:'bold'
  },
  TxtStatus:{
    color: global.styles.text3,
    fontSize: 17 * global.scale,
    fontWeight: "500"
  },
  productName:{
    color:global.styles.textLight2,
    fontSize: 16 * global.scale,
    marginLeft: 10 * global.scale,
    marginRight: 10 * global.scale,
  },
  productPrice:{
    fontSize: 17 * global.scale,
    color:global.styles.text3,
    alignItems:'center',
    justifyContent: 'center',
    textAlign:'center',
    fontWeight: "600"
  },
  triangle: {
    width: 50 * global.scale,
    height: 50 * global.scale,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 50 * global.scale,
    borderLeftWidth: 50 * global.scale,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    borderLeftColor: 'transparent',
  },
});

//make this component available to the app
const mapStateToProps = ({ Lang, orderHistory, user }) => ({ Lang, orderHistory, user });
export default connect(mapStateToProps, { fetchData }, null, { forwardRef: true })(OrderHistoryWrap);
