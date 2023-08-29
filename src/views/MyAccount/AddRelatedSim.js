import React, { Component } from 'react';
import { 
  View,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon
} from 'native-base'
import { TextField } from 'react-native-material-textfield';
import I18n from "../../langs"
import { MyHeader } from '../../component/MyHeader'
import { Actions, ActionConst } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Statusbar from '../../component/Statusbar'
import { connect } from 'react-redux'
import { fetchingData } from '../../actions/fetch';
import Loading from '../../component/loading'

class AddRelatedSim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref_code:null,
      name:this.props.nickname||'',
      phone:this.props.phone||'',
    };
  }

  submit(){
    this.Loading.show();
    this.props.fetchingData({
      start:'SUBMIT_RELATED_SIM_START',
      next:'SUBMIT_RELATED_SIM_SUCCESS', 
      rejected:'SUBMIT_RELATED_SIM_ERROR', 
      method:'POST',
      url:'relatedSim.php', 
      data:{
        "index":this.props.mode=='edit'?this.props.index:-1,
        "email":this.props.email,
        "password":this.props.password,
        "phone":this.state.phone,
        "nickname":this.state.name,
        "action":this.props.mode=='edit'?"edit":"add"
      },
      callback:(data, isError)=>{
        this.Loading.hide();
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 200);
        }else{
          if(this.props.mode=='edit'){
            Actions.pop()
          }else{
            Actions.RelatedSimConfirm({
              type:ActionConst.REPLACE, 
              email:this.props.email,
              password:this.props.password,
              phone:this.state.phone,
              nickname:this.state.name,
              index:this.props.index,
            });
          }
          // this.state.address_id = data.data;
          // this.props.AddressAdd(this.state, this.index);
        }
      }
    });
    // Actions.pop({refresh: {a:Math.random()}}), 
    // setTimeout(()=>{
    //   Alert.alert(this.props.mode=='edit'?I18n.t("Edit"):I18n.t("Add"),
    //   I18n.t("Success")),
    //   [{text: I18n.t('OK'), onPress: () =>  console.log("Press OK")}],
    //   {cancelable: false}
    // }, 300) 
  }

  render() {
    return (
      <Container style={{ backgroundColor:global.styles.body}}>
        <Statusbar
          backgroundColor={global.styles.body}
          barStyle="dark-content"/>
        <MyHeader
          renderLeft={
            <Button transparent onPress={ () => Actions.pop()}>
              <Icon name="ios-arrow-back" style={{fontSize:30,color:global.styles.textDark1}} />
            </Button>
          }
          />
        <Loading ref={(Loading) => this.Loading = Loading} />
        <View style={{alignItems:'center', justifyContent:'center' }}>
        <Text style={{fontSize:22, fontWeight:'bold',color:global.styles.textDark1}}>{this.props.mode=='edit'?I18n.t('Edit Related Sim'):I18n.t('Add Related Sim')}</Text>
        <TextField
            inputContainerStyle={{width: "70%", alignSelf: 'center', borderBottomColor:global.styles.text, alignItems:'center', textAlign:'center', justifyContent:'center'}}
            style={{alignSelf: 'center',alignItems:'center', textAlign:'center', justifyContent:'center'}}
            textColor={global.styles.text}
            baseColor={global.styles.text}
            labelFontSize={16}
            fontSize={22}
            label={I18n.t('Phone')}
            value={this.props.mode=='edit'?global.omitString(this.state.phone):this.state.phone}
            onChangeText={ (phone) => this.setState({ phone }) }
            returnKeyType='next'
            tintColor={global.styles.text}
            keyboardType='phone-pad'
            maxLength={8}
            editable={this.props.mode=='edit'?false:true}
            // onSubmitEditing={()=>this.onSubmit(1)}
          />
        </View>
        <View style={{ justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20, marginTop:10, padding:5}}>
            {/* <Text style={{ color: 'white', fontSize:24, fontWeight:'800'}}>{I18n.t('Referral Code')}</Text> */}
          </View>

          <TextField
            inputContainerStyle={{width: "70%", alignSelf: 'center', borderBottomColor:global.styles.text, alignItems:'center', textAlign:'center', justifyContent:'center'}}
            style={{alignSelf: 'center',alignItems:'center', textAlign:'center', justifyContent:'center'}}
            textColor={global.styles.text}
            baseColor={global.styles.text}
            labelFontSize={16}
            fontSize={22}
            label={I18n.t('Nickname')}
            value={this.state.name}
            onChangeText={ (name) => this.setState({ name }) }
            returnKeyType='next'
            tintColor="#666"
            // onSubmitEditing={()=>this.onSubmit(1)}
          />
          <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
            <TouchableOpacity 
              onPress={()=> this.submit()}
              style={{ borderWidth:1, borderColor:global.styles.text, borderRadius:8, padding:10, width:100, alignItems:'center'}}>
              <Text style={{ fontSize:16, color:global.styles.text, }}>{I18n.t('Confirm')}</Text>
            </TouchableOpacity>
          </View>
      </Container>
    );
  }
}





export default connect(null, { fetchingData })(AddRelatedSim);