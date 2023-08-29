import React, { Component } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert, 
  Dimensions
} from 'react-native';
import {
  Container,
  Content,
  Icon
} from 'native-base'
// import BarcodeScanner from 'react-native-barcode-scanner-universal';
import I18n from "../../langs"
import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera'
import Statusbar from '../../component/Statusbar';
import { MyHeader } from '../../component/MyHeader'
import { Actions, ActionConst } from 'react-native-router-flux';
import { fetchData } from '../../actions/fetch';
import Loading from '../../component/loading';

import BackgroundImage from '../../component/BackgroundImage';

var win = Dimensions.get("window");
class ScanSim extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.isScanned = false;
  }

  render() {
    let scanArea = null
    if (Platform.OS === 'ios') {
      scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      )
    } 
    return (
      <View style={{flex:1, backgroundColor:global.colors.background.root}}>
        <BackgroundImage  source={require('../../images/background.png')} />
        <Statusbar
          backgroundColor={'#00000000'}
          barStyle="dark-content"
          />
        <MyHeader 
          title="Scan Sim"
          titleColor={global.styles.headerTxt}
          renderLeft={
              <TouchableOpacity transparent style={{paddingLeft:10,paddingRight:10}} onPress={ () => this.props.GoHome?Actions.Home():Actions.pop()}>
                <Icon name="ios-arrow-back" style={{fontSize:30,color:global.styles.headerTxt}} />
              </TouchableOpacity>
            }
          renderRight={
            this.props.no_skip?<View/>:
          this.props.mode=='relateSim'
            ?
            <TouchableOpacity 
              onPress={()=>Actions.pop()}
              style={{ borderWidth:1, borderColor:global.styles.headerTxt, borderRadius:4,  padding:2, marginTop:4, marginRight:10, width:50, alignItems:'center'}}>
              <Text style={{ fontSize:16, color:global.styles.headerTxt, }}>{I18n.t('Cancel')}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity 
              onPress={()=>{Actions.Home(), 
                setTimeout(()=>{
                  Alert.alert(I18n.t("Congratulations"),
                  I18n.t("Welcome to join our family"),
                  [{text: I18n.t('OK'), onPress: () =>  console.log("Press OK")}],
                  {cancelable: false})
                }, 1000) }}
              style={{ borderWidth:1, borderColor:global.styles.headerTxt, borderRadius:4, padding:2, marginTop:4, marginRight:10, width:50, alignItems:'center'}}>
              <Text style={{ fontSize:16, color:global.styles.headerTxt, }}>{I18n.t('Skip')}</Text>
            </TouchableOpacity>
          }
            />
        <Loading ref={(Loading) => this.Loading = Loading} />
        <RNCamera
            // barCodeTypes={[
            //   RNCamera.Constants.BarCodeType.qr,
            //   RNCamera.Constants.BarCodeType.code128,
            // ]}
            captureAudio={false}
            defaultTouchToFocus
            mirrorImage={false}
            flashMode={RNCamera.Constants.FlashMode.on}
            style={styles.camera}
            onBarCodeRead={(code) => this.onReadCode(code)}
            ref={cam => (this.camera = cam)}
            >
        </RNCamera>
        <View style={{ marginTop:10 * global.scale, marginBottom:20 * global.scale}}>
          <Text style={{  textAlign:'center', fontSize:18, color:global.styles.headerTxt}}>{I18n.t('Please scan QR code on eFun sim card')}</Text>
        </View>
      </View>
    );
  }

  resetScan(){
    setTimeout(() => {
      this.isScanned=false;
    }, 1500);
  }

  submitDate(code){
    if(this.props.mode=='relateSim'){
      Actions.AddRelatedSim({ type: ActionConst.REPLACE, iccid:code});
    }else{

      this.Loading.show();
      
      let attributes = this.props.user.user.custom_attributes;
      attributes['iccid'] = code;
      
      this.props.fetchData({
        next:'FETCH_VERIFICATION_ICCID_SUCCESS', 
        rejected:'FETCH_VERIFICATION_ICCID_ERROR', 
        method:'POST',
        url:'customer/attributes', 
        data:{
          "token":this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired,
          "firstname":this.props.user.user.firstname,
          "lastname":this.props.user.user.lastname,
          "email":this.props.user.user.email,
          "websiteId":this.props.user.user.website_id,
          "attributes":attributes,
          "lang":I18n.currentLocale(),
        },
        callback:(data, isError)=>{
          this.Loading.hide();
          if(isError){
            if(data.retCode){
              setTimeout(() => {
                Alert.alert(
                  I18n.t("Code:"+data.retCode, {defaultValue: "Code:"+data.retCode}),
                  I18n.t(data.message, {defaultValue: data.message}),
                  [
                    {text: I18n.t('OK'), onPress: () => this.resetScan()}
                  ],
                  { cancelable: false }
                );
                this.resetScan();
              }, 100);
            }else{
              setTimeout(() => {
                Alert.alert(
                  "",
                  I18n.t(data.message, {defaultValue: data.message}),
                  [
                    {text: I18n.t('OK'), onPress: () => this.resetScan()}
                  ],
                  { cancelable: false }
                );
              }, 100);
            }
            
          }else{
            setTimeout(() => {
              Actions.ConfirmSim({ type: ActionConst.REPLACE, iccid:code});
            }, 100)
          }
        }
      });
    }
  }

  onReadCode(code){
    if(!this.isScanned){
      let type = code.type.toLocaleLowerCase();
      if(type=='org.iso.qrcode' || type=='qr_code' || type=='org.iso.code128' || type=="code_128"){
        this.isScanned=true;
        Alert.alert(
          code.data,
          I18n.t("Is Correct"),
          [
            {text: I18n.t('NO'), onPress: () => this.resetScan()},
            {text: I18n.t('Yes'), onPress: () => this.submitDate(code.data)}
          ],
          { cancelable: false }
        )
        // if(code.data.indexOf('-') != -1){
        //   iccid = code.data.split('-')[0];
        //   code = code.data.split('-')[1];
          
          
        // }else{
        //   imei = null;
        //   pwd = null;
        //   Alert.alert(
        //     I18n.t("Warning"),
        //     I18n.t("Please Scan eFun Sim."),
        //     [{text: 'OK', onPress: () => {this.isScanned=false}}],
        //     {cancelable: false}
        //   )
        // }
      }
    }
  }
}

const styles = StyleSheet.create({
  camera: {
    width: win.width,
    height: (win.width*4/3),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

const mapStateToProps = ({ Lang, user }) => ({ Lang, user });
export default connect(mapStateToProps, { fetchData }, null, { forwardRef: true })(ScanSim);
