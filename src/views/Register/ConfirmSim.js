import React, { Component } from 'react';
import { 
  View,
  Text,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon
} from 'native-base';
import CodeInput from 'react-native-confirmation-code-field';
import I18n from "../../langs";
import { connect } from 'react-redux';
import { MyHeader } from '../../component/MyHeader';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Statusbar from '../../component/Statusbar';
import { fetchingData } from '../../actions/fetch';
import Loading from '../../component/loading';

import BackgroundImage from '../../component/BackgroundImage';

let win = Dimensions.get("window");
class ConfirmSim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref_code:''
    };
  }

  onSubmit(){
      if(this.state.ref_code.length==7){
        this.props.fetchingData({
          next:'SEND_REFERRAL_CODE_SUCCESS', 
          rejected:'SEND_REFERRAL_CODE_ERROR', 
          method:'POST',
          url:'customer.php', 
          data:{
            "email":this.props.user.user.email,
            "password":this.props.user.user.password,
            "code":this.state.ref_code,
            "action":"referralSubmit"
          },
          callback:(data, isError)=>{
            this.Loading.hide();
            if(isError){
              setTimeout(() => {
                Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
                this.isScanned=false;
              }, 100);
            }else{
              Actions.Home();
              setTimeout(()=>{
                Alert.alert(I18n.t("Congratulations"),
                I18n.t("Welcome to join our family"),
                [{text: I18n.t('OK'), onPress: () =>  console.log("Press OK")}],
                {cancelable: false})
              }, 1000);
            }
          }
        });
      }else{
        Alert.alert(I18n.t("Incorrect Referral Code"))
      }
  }

  onSkip(){
    Actions.EarnRewards({skip:true}); 
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:global.colors.background.root}}>
        <BackgroundImage  source={require('../../images/Login.png')} />
        <Statusbar
          backgroundColor={'#00000000'}
          barStyle="dark-content"/>
        <MyHeader
          renderLeft={
            <Button transparent onPress={ () => Actions.pop()}>
              <Icon name="ios-arrow-back" style={{fontSize:30,color:'#fff'}} />
            </Button>
          }
          />
        <Loading ref={(Loading) => this.Loading = Loading} />
        <Content>
          <View style={{ height:win.height, justifyContent:'center', alignItems:"center" }}>
            <View style={{height:'30%'}} />
            <KeyboardAwareScrollView enableOnAndroid={true}>
              <View style={{justifyContent:'center', alignItems:"center" }}>
                <Text style={{fontSize:22, fontWeight:'bold',color:global.styles.headerTxt}}>{I18n.t('Your Sim Information')}</Text>
                <Text style={{fontSize:20, fontWeight:'bold',color:global.styles.headerTxt, marginTop:10}}>ICCID: {this.props.iccid}</Text>
              </View>
              <View style={{ justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20, marginTop:20, padding:5}}>
                  <Text style={{ color: global.styles.headerTxt, fontSize:24, fontWeight:'800'}}>{I18n.t('Referral Code')}</Text>
                </View>
                <View >
                  <CodeInput 
                    style={{color:global.styles.text2, fontSize:22*global.scale,paddingTop:10}}
                    size={44*global.scale}
                    // inputPosition="full-width"
                    // variant="border-circle"
                    activeColor={global.styles.headerTxt}
                    inactiveColor={global.styles.textLight2}
                    ref="refName" 
                    autoFocus={false} 
                    codeLength={7}

                    inputProps={{autoCapitalize: 'characters'}}
                    cellProps={{autoCapitalize: 'characters'}}
                    keyboardType="default"
                    onFulfill={(code)=>this.setState({ref_code:code})} />
                </View>
                <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
                  <TouchableOpacity 
                    onPress={()=>this.onSubmit()}
                    style={ [styles.testBox, {backgroundColor:global.colors.btn.registerActive}] }
                    >
                    <Text style={{ fontSize:16, color:global.colors.text.t1, }}>{I18n.t('EarnRewards')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>this.onSkip()}
                    style={ [styles.testBox] } 
                    >
                    <Text style={{ fontSize:16, color:global.colors.text.t1, }}>{I18n.t('Skip')}</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cellStyles:{
    marginTop:3
  },
  testBox:{
    padding:20,
    marginTop:20,
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:global.colors.btn.register,
    width:'40%',
  }
});

const mapStateToProps = ({ Lang, user }) => ({ Lang, user });
export default connect(mapStateToProps, { fetchingData }, null, { forwardRef: true })(ConfirmSim);