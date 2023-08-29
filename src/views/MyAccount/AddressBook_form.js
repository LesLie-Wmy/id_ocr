import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
  CheckBox
} from 'native-base'
import { connect } from 'react-redux';

import I18n from "../../langs"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import { TextField } from 'react-native-material-textfield';
import { Actions } from 'react-native-router-flux'
import { Dropdown } from 'react-native-material-dropdown';
import { AddressAdd, setDefault } from "../../actions/addressBook";
import { fetchData } from '../../actions/fetch';
import Loading from '../../component/loading'
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
 
class AddressBookForm extends Component {
  constructor(props){
    super(props);
    if(props.data){
      this.state={
        address_id:props.data.address_id||null,
        firstname:props.data.firstname||'',
        lastname:props.data.lastname||'',
        phone:props.data.telephone||'',
        // address_1:props.data.street.join(" ")||'',
        street2:Array.isArray(props.data.street)?props.data.street[1]:'',
        street1:Array.isArray(props.data.street)?props.data.street[0]:'',
        city:props.data.city||'',
        country:props.data.country_id||'',
        postcode:props.data.postcode||'',
        default:this.props.default,
      }
    }else{
      this.state={
        address_id:null,
        firstname:'',
        lastname:'',
        phone:'',
        room:'',
        building:'',
        estate:'',
        street2:'',
        street1:'',
        district:'',
        city:'',
        country:'',
        postcode:'',
        default:this.props.default
      }
    }
    this.index=-1;
    if(props.index>=0){
      this.index=props.index;
    }
    
  }

  saveAddress(){
    if(this.state.address_id==""){
      Alert.alert(I18n.t("Address can't empty"));
      return false
    }else if(this.state.firstname==''){
      Alert.alert(I18n.t("Firstname can't empty"));
      return false
    }else if(this.state.lastname==''){
      Alert.alert(I18n.t("Lastname can't empty"));
      return false
    }else if(this.state.phone==''){
      Alert.alert(I18n.t("Phone can't empty"));
      return false
    }
    // else if(this.state.room==''){
    //   Alert.alert(I18n.t("Room can't empty"));
    //   return false
    // }else if(this.state.building==''){
    //   Alert.alert(I18n.t("Building can't empty"));
    //   return false
    // }
    else if(this.state.street1==''){
      Alert.alert(I18n.t("Address can't empty"));
      return false
    }
    else if(this.state.city==''){
      Alert.alert(I18n.t("District can't empty"));
      return false
    }else if(this.state.country==''){
      Alert.alert(I18n.t("Country can't empty"));
      return false
    }
    
    this.Loading.show();
    let newAddr = {
      "firstname": this.state.firstname,
      "lastname": this.state.lastname,
      "street": [
        this.state.street1,
        this.state.street2,
      ],
      "city": this.state.city,
      "country_id": this.state.country,
      "telephone": this.state.phone,
      // "custom_attributes": [
      //   {
      //     "attribute_code": "room",
      //     "value": this.state.room
      //   },
      //   {
      //     "attribute_code": "building",
      //     "value": this.state.building
      //   },
      //   {
      //     "attribute_code": "estate",
      //     "value": this.state.estate
      //   }
      // ]
    };
    // if(this.props.user.user.addresses)
    let address = [...this.props.user.user.addresses, newAddr ]
    this.props.fetchData({
      start:'FETCH_SAVE_ADDRESS_START',
      next:'FETCH_SAVE_ADDRESS_SUCCESS', 
      rejected:'FETCH_SAVE_ADDRESS_ERROR', 
      method:'POST',
      url:'address/add', 
      data:{
        "email":this.props.user.user.email,
        "firstname":this.state.firstname,
        "lastname":this.state.lastname,
        "websiteId":global.websiteId,
        "address":address,
        "lang":I18n.currentLocale(),
        "token":this.props.user.user.token,
        'tokenExpired':this.props.user.user.tokenExpired,
      },
      callback:(data, isError)=>{
        this.Loading.hide();
        if(isError){
          setTimeout(() => {
              Alert.alert('',
              I18n.t(data.message, {defaultValue: data.message}),
              [
                {text: I18n.t('OK'), onPress: () => console.log('Cancel Pressed')}
              ],
              { cancelable: false })
            }, 200
          );
        }else{
          setTimeout(() => {
            Alert.alert(null,I18n.t("Success"),
            [
              {text:"OK", onPress:() =>  Actions.pop()}
            ],
            {cancelable: false},);
          }, 200); 
          // if(data.data>1){
          //   this.state.address_id = data.data;
          // }
          // this.props.AddressAdd(this.state, this.index);
          // if(data.default){
          //   this.props.setDefault(this.state);
          // }
        }
      }
    });
  }

  render() { 
    return (
      <Container style={styles.container}>
        <Statusbar backgroundColor={global.colors.background.statusBar}/>
        <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader 
            title={I18n.t('AddressBook')}
            titleColor={global.colors.text.statusBar}
          />
        </View>
        <Loading ref={(Loading) => this.Loading = Loading} />
        <Content style={{flex:1, padding:30}}>
          <TextField label={I18n.t('Firstname')}
              value={this.state.firstname} 
              onChangeText={ (firstname) => this.setState({ firstname }) }
              onSubmitEditing={()=>this.refs.Lastname.focus()}

            />
          <TextField 
              label={I18n.t('Lastname')}  
              ref="Lastname"
              value={this.state.lastname} 
              onChangeText={ (lastname) => this.setState({ lastname }) }
              onSubmitEditing={()=>this.refs.Phone.focus()}
            />
          <TextField 
              label={I18n.t('Phone')}
              ref="Phone"
              keyboardType="phone-pad"
              value={this.state.phone}
              onChangeText={ (phone) => this.setState({ phone }) }
              onSubmitEditing={()=>this.refs.street1.focus()}
            />
          {/* <TextField
              label={I18n.t('Room/Flat/Floor/Block')}
              ref="room"
              value={this.state.room}
              onChangeText={ (room) => this.setState({ room }) }
              onSubmitEditing={()=>this.refs.building.focus()}
            />
          <TextField
              label={I18n.t('Building')}
              ref="building"
              value={this.state.building}
              onChangeText={ (building) => this.setState({ building }) }
              onSubmitEditing={()=>this.refs.estate.focus()}
            />
          <TextField
              label={I18n.t('Estate')}
              ref="estate"
              value={this.state.estate}
              onChangeText={ (estate) => this.setState({ estate }) }
              onSubmitEditing={()=>this.refs.street.focus()}
            /> */}
          <TextField
              label={I18n.t('Address 1')}
              ref="street1"
              value={this.state.street1}
              onChangeText={ (street1) => this.setState({ street1 }) }
              onSubmitEditing={()=>this.refs.street2.focus()}
            />
          <TextField
              label={I18n.t('Address 2')}
              ref="street2"
              value={this.state.street2}
              onChangeText={ (street2) => this.setState({ street2 }) }
              onSubmitEditing={()=>this.refs.District.focus()}
            />
          <TextField
              label={I18n.t('District')}
              ref="District"
              value={this.state.city}
              onChangeText={ (city) => this.setState({ city }) }
              onSubmitEditing={()=>this.refs.Country.focus()}
            />
          <Dropdown  
            label={I18n.t('Country')} 
            ref="Country"
            data={
              [{
                label: I18n.t('Hong Kong'),
                value: 'HK',
              }, {
                label: I18n.t('Macau'),
                value: 'MC',
              }
              ]}
            value={this.state.country}
            onChangeText={(val) => this.setState({ country:val })}
              />
          {/* <TextField label={I18n.t('Country')}  value={this.state.country} onChangeText={ (country) => this.setState({ country }) }/>
          <TextField label={I18n.t('Postcode')}  value={this.state.postcode} onChangeText={ (postcode) => this.setState({ postcode }) }/> */}
          <TouchableOpacity
            style={{
              borderColor:'#ccddd3',
              borderWidth:1,
              alignItems:'center',
              justifyContent:'center',
              borderRadius:20,
              marginTop:30,
              width:'90%',
              alignSelf:'center',
              }}
            onPress={()=>this.saveAddress()}
            >
            <Text 
              style={{
                margin:10,
                fontSize:20* global.scale,
                color:'#421173'
              }}
            >{I18n.t('SAVE')}</Text>
          </TouchableOpacity>
          <View style={{height:80}} />
        </Content>
      </Container>
    );
  }
}
 
const mapStateToProps = ({ user, Lang, addressBook }) => ({ user, Lang, addressBook });
export default connect(mapStateToProps, { AddressAdd, fetchData, setDefault }, null, { forwardRef: true })(AddressBookForm);