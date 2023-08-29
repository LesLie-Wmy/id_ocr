//import libraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  To
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
import Toast, {DURATION} from 'react-native-easy-toast'

import { AddressDelete, setDefault } from '../../actions/addressBook'

import I18n from '../../langs';
import Statusbar from '../../component/Statusbar';
import { fetchingData, fetchData } from '../../actions/fetch';
import MyHeader from '../../component/MyHeader';
import {LoadingWithoutModal} from '../../component/LoadingWithoutModal';
import Loading from '../../component/loading';
// create a component
class AddressBook extends Component {
  constructor(props){
    super(props);
    this.state={
      onLoading:false,
      onPayment:this.props.onPayment||false,
    }
    this.address = {};
  }

  componentDidMount(){
    // this.onLoadData();
  }

  // componentWillReceiveProps(props){
  //   if(props.user.user.address.address_id){
  //     this.setState({
  //       address_id:props.user.user.address.address_id
  //     })
  //   }
  // }

  setDefault(id){
    let lang = I18n.currentLocale();
    this.props.fetchData({
      start:'FETCH_ADDRESS_Default_START',
      next:'FETCH_ADDRESS_Default_SUCCESS', 
      rejected:'FETCH_ADDRESS_Default_ERROR', 
      method:'POST',
      url:'/address/default/'+id, 
      data:{
        'firstname':this.props.user.user.firstname,
        'lastname':this.props.user.user.lastname,
        'email':this.props.user.user.email,
        'websiteId':this.props.user.user.website_id,
        'lang':lang,
        'token':this.props.user.user.token,
        'tokenExpired':this.props.user.user.tokenExpired,
      },
      callback:(data, isError)=>{
        this.refs.Loading.hide();
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 200);
        }else{
          this.setState({
            address_id:id
          })
          this.props.setDefault(id);
          this.refs.toast.show('Set as shipping address');
        }
      }
    });
  }

  onAddressPress(item){
    if(this.state.onPayment){
      Actions.pop({ refresh: {onChangeAddressBack:true, address:item}, timeout: 1});
    }else{
      this.refs.Loading.show();
      this.setDefault(item.id);
    }
  }

  onEdit(item, index){
    Actions.AddressBookForm({data:item, index:index, default:this.props.user.user.address.length > 0 && this.address_id==item.address_id?item.address_id:null});
  }

  onDelete(id, index){
    Alert.alert(
      I18n.t('Confirm'),
      I18n.t('Do you want to Delete?'),
      [
        {text:I18n.t('Cancel'), onPress:()=>console.log('Cancel Delete Address.')},
        {text:I18n.t('Yes'), onPress:()=>this.doDelete(id, index)},
      ]
    )
  }

  doDelete(id, index){
    this.props.fetchingData({
      start:'FETCH_DELETE_ADDRESS_START',
      next:'FETCH_DELETE_ADDRESS_SUCCESS', 
      rejected:'FETCH_DELETE_ADDRESS_ERROR', 
      method:'POST',
      url:'address.php', 
      data:{
        "email":this.props.user.user.email,
        "pass":this.props.user.user.password,
        "address_id":id,
        "action":"delete"
      },
      callback:(data, isError)=>{
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 200);
        }else{
          this.props.AddressDelete(index);
        }
      }
    });
  }

  render() {
    if(this.state.onLoading){
      return (
        <Container style={{flex:1, backgroundColor:global.colors.background.statusBar}}>
          <Statusbar backgroundColor={global.colors.background.statusBar}/>
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              title={I18n.t('AddressBook')}
              titleColor={global.colors.text.statusBar}
              renderLeft={
                <TouchableOpacity transparent style={{paddingLeft:10, paddingRight:10}} onPress={() => this.state.onPayment?Actions.pop({ refresh: {onChangeAddressBack:true}, timeout: 10}):Actions.pop()}>
                  <Icon name="ios-arrow-back" style={{fontSize:30,color:global.colors.text.statusBar}} />
                </TouchableOpacity>
              }
            />
          </View>
          <LoadingWithoutModal style={{backgroundColor:global.colors.background.statusBar, height:'100%' }} Color='#3c3c42' textColor='#333' ref="Loading" isShow={true} text={I18n.t('Loading')} />
        </Container>
      );
    }else if(!this.props.addressBook.isLoading && this.props.addressBook.list.length==0){
      return (
        <Container style={{flex:1, backgroundColor:global.colors.background.statusBar}}>
          <Statusbar backgroundColor={global.colors.background.statusBar}/>
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              title={I18n.t('AddressBook')}
              titleColor={global.colors.text.statusBar}
              renderLeft={
                <TouchableOpacity transparent style={{paddingLeft:10, paddingRight:10}} onPress={() => this.state.onPayment?Actions.pop({ refresh: {onChangeAddressBack:true}, timeout: 10}):Actions.pop()}>
                  <Icon name="ios-arrow-back" style={{fontSize:30,color:global.colors.text.statusBar}} />
                </TouchableOpacity>
              }
              renderRight={
                <TouchableOpacity style={{width:35,height:35,marginRight:5}} onPress={()=>Actions.AddressBookForm({index:-1,default:this.props.addressBook.list.length==0?true:null})}>
                  <Icon type='Entypo' name='plus' style={{fontSize:35, color:global.colors.text.statusBar}} />
                </TouchableOpacity>
              }
            />
          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}} >
            <Text style={{color:global.styles.text, fontSize:20}}>{I18n.t('No Record Found')}</Text>
          </View>
        </Container>
      );
    }else{
      return (
        <Container style={{flex:1}}>
          <Statusbar backgroundColor={global.colors.background.statusBar}/>
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              title={I18n.t('AddressBook')}
              titleColor={global.colors.text.statusBar}
              renderLeft={
                <TouchableOpacity transparent style={{paddingLeft:10, paddingRight:10}} onPress={() => this.state.onPayment?Actions.pop({ refresh: {onChangeAddressBack:true, address:this.address}, timeout: 10}):Actions.pop()}>
                  <Icon name="ios-arrow-back" style={{fontSize:30,color:global.colors.text.statusBar}} />
                </TouchableOpacity>
              }
              renderRight={
                <TouchableOpacity style={{width:35,height:35,marginRight:5}} onPress={()=>Actions.AddressBookForm({index:-1,default:this.props.addressBook.list.length==0?true:null})}>
                  <Icon type='Entypo' name='plus' style={{fontSize:35, color:global.colors.text.statusBar}} />
                </TouchableOpacity>
              }
            />
          </View>
            <Loading style={{backgroundColor:global.colors.text.d2, height:'100%' }} Color='#3c3c42' textColor='#333' ref="Loading" isShow={false} />
            
            {
              this.props.user.user.addresses > 0
              ?
              <FlatList
                data={this.props.user.user.addresses}
                style={{flex:1, }}
                contentContainerStyle={{paddingBottom:30}}
                renderItem={({item, index}) => this.renderItem({item, index})}
                // onEndReached={1}
              />
              :
              <View style={{height:'100%', width:'100%', alignItems:'center', marginTop:10}}>
                <Text style={{color:global.colors.text.t2}}>-- {I18n.t("No Record Found")} --</Text>
              </View>
            }
            <Toast ref="toast" defaultCloseDelay={2000}/>
        </Container>
      );
    }
  }

  renderItem({item, index}){
    this.address_id=this.props.onPayment?this.props.address.id:this.props.user.user.default_shipping
    if(this.address_id==item.id){
      this.address=item;
    }
    return(
      <View style={[styles.container,{backgroundColor:global.styles.bodyLight}, this.props.onPayment && this.address_id==item.id?styles.default:styles.undefault]}>
        <TouchableWithoutFeedback  onPress={()=>this.onAddressPress(item)} style={{flex:1}}>
          <View  style={{flex:1, marginTop: 20, margin:10}}>
            <View style={styles.row}>
              <Icon type='AntDesign' name='user' style={{fontSize:26,color:global.styles.textLight2}} />
              <Text style={{textAlign:'center', fontSize:20* global.scale, color:global.styles.textLight1}}>{item.firstname} {item.lastname}</Text>
            </View>
            <View style={styles.row}>
              <Icon type='AntDesign' name='mobile1' style={{fontSize:26,color:global.styles.textLight2}} />
              <Text style={{textAlign:'center', fontSize:20* global.scale, color:global.styles.textLight1}}>{global.omitString(item.telephone)}</Text>
            </View>
            <View style={[styles.row,{alignItems:'center'}]}>
              <Icon type='AntDesign' name='enviromento' style={{fontSize:26,color:global.styles.textLight2}} />
              <Text style={{textAlign:'left', fontSize:20* global.scale, color:global.styles.textLight1}} numberOfLines={2} ellipsizeMode='tail'>{global.omitString(item.street.join(" "))}, {item.city}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{margin:16, paddingLeft:14, paddingRight:10, borderLeftColor:global.styles.textLight3, borderLeftWidth:1}}>
          <TouchableOpacity 
            style={{flex:1, justifyContent:'center', alignItems:'center'}}
            onPress={()=>this.onEdit(item, index)}
            >
            <Icon type='AntDesign' name='form' style={{fontSize:30* global.scale, color:global.styles.icon}} />
          </TouchableOpacity>
          {
            this.address_id==item.address_id?null:
            <TouchableOpacity 
              style={{flex:1, justifyContent:'center', alignItems:'center'}}
              onPress={()=>this.onDelete(item.address_id, index)}
              >
              <Icon type='AntDesign' name='delete' style={{fontSize:30* global.scale, color:global.styles.icon}} />
            </TouchableOpacity>
          }
        </View>
        {
          this.address_id!=item.id?null:
          <View 
            style={{position: 'absolute', }}>
            {/* <TouchableOpacity
              onPress={()=>this.props.setDefault(item)}
              activeOpacity={1} 
              style={{flex:1}}
              > */}
              <View style={[styles.triangle,{borderTopColor:this.address_id==item.address_id?"#f00":'#cdc'}]}/>
              <Icon type='AntDesign' name='star' style={{fontSize:23 * global.scale, color:this.address_id==item.id?global.styles.textLight4:global.styles.textLight3,marginLeft:4 * global.scale, marginTop:4 * global.scale}} />
            {/* </TouchableOpacity> */}
          </View>
        }
      </View>
    )
  }
}

// define your styles
const styles = StyleSheet.create({
  container:{
    paddingLeft:20, 
    borderBottomColor: '#9963B299',
    borderBottomWidth:1,
    flexDirection:'row',
    marginBottom:10,
  },
  row:{
    flexDirection:'row', 
    marginBottom: 4,
    marginRight: 5
  },
  default:{
    borderColor:'#f00',
    borderWidth:4,
    overflow:"hidden",
    borderBottomColor: '#f00',
    borderBottomWidth:4,
  },
  undefault:{
    borderColor:'#f00',
    borderWidth:0,
    overflow:"hidden",
    borderBottomColor: '#f00',
    borderBottomWidth:0,
  },
  triangle: {
    position: 'absolute',
    width: 55 * global.scale,
    height: 55 * global.scale,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 55 * global.scale,
    borderRightWidth: 55 * global.scale,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },

});

//make this component available to the app
const mapStateToProps = ({ simHome, Lang, addressBook, user }) => ({ simHome, Lang, addressBook, user });
export default connect(mapStateToProps, { AddressDelete, fetchingData, fetchData, setDefault }, null, { forwardRef: true })(AddressBook);
