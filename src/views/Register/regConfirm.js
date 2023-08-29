import React, { Component } from 'react';
import { 
  View,
  Text,
  Alert,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import {
  Container,
  Content
} from 'native-base'
import { connect } from 'react-redux';
import { fetchData } from '../../actions/fetch';
import I18n from "../../langs"
import { MyHeader } from '../../component/MyHeader'
import CodeInput from 'react-native-confirmation-code-field';
import { Actions, ActionConst } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Statusbar from '../../component/Statusbar'
import Loading from '../../component/loading';

import Toast, {DURATION} from 'react-native-easy-toast'

import BackgroundImage from '../../component/BackgroundImage';
import { timeInterval } from 'rxjs/operators';

let win = Dimensions.get("window");

class RegConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "timeLeft":0,
      email:props.email
    };
  }

  handlerOnFulfill = (code, isValid) => {
    // isValid ? Actions.ScanSim() : [ Alert.alert("Alert","error"), this.refs.refName.clear() ];
    this.Loading.show();
    this.props.fetchData({
      next:'FETCH_VERIFICATION_USER_SUCCESS', 
      rejected:'FETCH_VERIFICATION_USER_ERROR', 
      method:'POST',
      url:'customer/confirmation', 
      data:{
        "email":this.state.email,
        "code":code,
      },
      callback:(data, isError)=>{
        this.Loading.hide();
        if(isError){
          setTimeout(() => {
            this.refs.refName.clear();
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 100);
        }else{
          setTimeout(() => {
            Actions.ScanSim({ type: ActionConst.REPLACE, GoHome:true });
          }, 100)
        }
      }
    });
  }

  _resendMail(){

    this.props.fetchData({
      next:'FETCH_VERIFICATION_RESEND_SUCCESS', 
      rejected:'FETCH_VERIFICATION_RESEND_ERROR', 
      method:'POST',
      url:'customer/resend/confirm', 
      data:{
        "email":this.state.email,
        "websiteId":global.websiteId,
      },
      callback:(data, isError)=>{
        this.Loading.hide();
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 100);
        }else{
          this.refs.toast.show(I18n.t('Sent'));
        }
      }
    });


    var that = this;
    this.setState({timeLeft:59});
    this.timer = setInterval(() => {
      let left = that.state.timeLeft-1;
      that.setState({timeLeft:left});
      if(left==0){
        clearInterval(that.timer);
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'flex-end', backgroundColor:global.colors.background.root}}>
        <BackgroundImage  source={require('../../images/Login.png')} />
        <Statusbar
          backgroundColor={'#00000000'}
          barStyle="dark-content"
          />
        <MyHeader title={I18n.t('Confirmation')} titleColor={global.styles.headerTxt} />
        <Loading ref={(Loading) => this.Loading = Loading} />
        
        <Content  >
        <View style={{ height:win.height, justifyContent:'center', alignItems:"center" }}>
          <View style={{height:'30%'}} />
          <KeyboardAwareScrollView enableOnAndroid={true}>
         { 
            this.props.email
            ?
            <View>
              <View style={{ justifyContent:'center', alignItems:'center', marginLeft:10, marginRight:10, padding:5}}>
                <Text style={{ color: global.styles.text, fontSize:18}}>{I18n.t('A confirmation email has been sent to your email account')}</Text>
              </View>
              <View style={{ justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20, padding:5}}>
                <Text style={{ color: "#8ACF45", fontSize:18, fontWeight:'bold'}}>{this.props.email}</Text>
              </View>
            </View>
            :
            <View>
              <View style={{ justifyContent:'center', alignItems:'center', marginLeft:10, marginRight:10, padding:5}}>
                <Text style={{ color: global.styles.text, fontSize:18}}>{I18n.t('A confirmation email has been sent to your email account')}</Text>
              </View>
              <View style={{ justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20, padding:5}}>
                <TextInput 
                  value={this.state.email}
                  onChange={(val => this.setState({email:val}))}
                  style={{ color: "#8ACF45", fontSize:18, fontWeight:'bold'}}>
                </TextInput>
              </View>
            </View>
          }
          
          <View style={{ justifyContent:'center', alignItems:'center', marginLeft:20, marginRight:20, marginTop:20, padding:5}}>
            <Text style={{ color: global.styles.text, fontSize:24, fontWeight:'bold', }}>{I18n.t('Verification Code')}</Text>
          </View>
          <View>
            <CodeInput 
              style={{color:global.styles.text2, fontSize:22}}
              size={50}
              ref="refName" 
              autoFocus={false} 
              activeColor={global.colors.text.t2}
              inactiveColor={global.colors.text.d3}
              codeLength={5} 
              keyboardType="numeric"
              
              containerStyle={{
                backgroundColor:'#fff',
                borderRadius: 10,
                shadowOffset: {width: 0,height: 2,}, 
                shadowOpacity: 0.23, 
                shadowRadius: 2.62, 
                elevation: 4,
                padding:5,
              }}
              // compareWithCode={"12345"} 
              onFulfill={this.handlerOnFulfill} />
          </View>


          <View style={{ width:'40%', alignSelf:'center'}}>
          {
            this.state.timeLeft == 0 ?
            <TouchableOpacity 
              style={ [styles.testBox, {backgroundColor:global.colors.btn.registerActive}] } 
              onPress={ () => this._resendMail(this.state.email)}
              >
              <Text style={{ color:global.colors.text.t1}}>{I18n.t('Resend')}</Text>
            </TouchableOpacity>:
            <View style={ styles.testBox}>
              <Text style={{ color:global.colors.text.t1}}>{I18n.t('Resend %{i}', {i:this.state.timeLeft})}</Text>
            </View>
          }
          </View>
          </KeyboardAwareScrollView>
        </View>
        <Toast 
          ref="toast" 
          defaultCloseDelay={2000}
          position='bottom'
          opacity={0.8}
        />
        </Content>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  testBox:{
    padding:15,
    marginTop:30,
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:global.colors.btn.register,
  }
})

const mapStateToProps = ({ user, Lang }) => ({ user, Lang });
export default connect(mapStateToProps, { fetchData })(RegConfirm);