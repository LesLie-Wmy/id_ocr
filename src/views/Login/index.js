import React, { Component } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Container,
  Content,
  Icon
} from 'native-base'
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux'
import Statusbar from '../../component/Statusbar'
import BackgroundImage from '../../component/BackgroundImage';
import SelectLanguage from '../../component/SelectLanguage'
import { TextField } from 'react-native-material-textfield'
import I18n from "../../langs"
import Loading from '../../component/loading'
import { fetchData } from '../../actions/fetch';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import SplashScreen from 'react-native-smart-splash-screen';

let win = Dimensions.get("window");
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email:'',
      Password:'',
      userInfo:'',
      secured:true
    };
  }

  componentDidMount(){
    SplashScreen.close({
        animationType: SplashScreen.animationType.scale,
        duration: 850,
        delay: 500,
    })

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '887426908046-6os94808rn2va8rmqomknjskr24u6pqk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
 
    this._fetchStoreConfig();
  }

  _fetchStoreConfig(){
    this.Loading.show();
    let lang = I18n.currentLocale();
    this.props.fetchData({
      start:'FETCHING_STORE_CONFIG_START',
      next:'FETCHING_STORE_CONFIG_SUCCESS',
      rejected:'FETCHING_STORE_CONFIG_ERROR',
      method:'POST',
      url:'store/configs',
      data:{'lang': lang},
      callback:() => this.Loading.hide()
    })
  }

  _SelectLanguage(){
    this.refs.Language._showLanguageSelection()
  }

  login(){
    if(this.state.Email!="" && this.state.Password!=""){
      this.Loading.show();
      this.props.fetchData({
        next:'FETCH_USER_LOGIN_SUCCESS', 
        rejected:'FETCH_USER_LOGIN_ERROR', 
        method:'POST',
        url:'customer/login', 
        data:{
          "email":this.state.Email,
          "password":this.state.Password,
          "storeId":global.storeId,
          "websiteId":global.websiteId
        },
        callback:(data, isError)=>{
          this.Loading.hide();
          this.fetchMineCart();
          if(isError){
            if(data.error_code=='0x901'){
              setTimeout(() => {
                Alert.alert(
                  I18n.t('Account Not Verify'),
                  "",
                  [  
                    {text:I18n.t('Cancel'), onPress:()=> console.log('Cancel')},
                    {text:I18n.t('Goto Verify'), onPress:()=> Actions.RegConfirm({"email":this.state.Email,"password":this.state.Password})},
                  ],
                  {cancelable:false});
              }, 100);
            }else{
              setTimeout(() => {
                // Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
                Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
              }, 100);
            }
          }else{
            setTimeout(() => {
              this.props.back?Actions.pop():Actions.Home();
            }, 100)
          }
        }
      });
    }else{
      Alert.alert(I18n.t('Email and Password is required'));
    }
  }

  _signInWithGL = async () => {
    this.Loading.show();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
      this.openIdLogin(userInfo, "google");
    } catch (error) {
      this.Loading.hide();
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // console.log("User Cancel");
        // setTimeout(() => {
        //   Alert.alert(
        //     I18n.t("User Cancel")
        //   )
        // }, 100);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("SignIn Already");
        setTimeout(() => {
          Alert.alert(
            I18n.t("SignIn Already")
          )
        }, 100);
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Service not available or outdated");
        setTimeout(() => {
          Alert.alert(
            I18n.t("Play Service not available or outdated")
          )
        }, 100);
        // play services not available or outdated
      } else {
        console.log(error);
        if(error.message){
          setTimeout(() => {
            Alert.alert(
              I18n.t(error.message,{ defaultValue:error.message})
            )
          }, 100);
        }
        
        // some other error happened
      }
    }
  };

  _signInWithFB = async () => {
    var that = this;
    this.Loading.show();
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          that.Loading.hide();
          console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              var token = data.accessToken;
              const infoRequest = new GraphRequest(
                  '/me',
                  {
                      accessToken: token,
                      parameters: {
                          fields: {
                              string: 'email,name,first_name,last_name',
                          },
                      },
                  },
                  (error, result) => that.facebookLoginCallback(error, result, token),
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start();
            }
          )
        }
      },
      function(error) {
        that.Loading.hide();
        console.log("Login fail with error: " + error);
      }
    );
  };


  facebookLoginCallback(error, result, token){
    if (error) {
        console.log(error);
         // THIS IS WHERE THE TIMEOUT OCCURS
    }
    else {
      let userData = {
        "idToken":token,
        "user":{
          "email":result.email,
          "id":result.id,
          "familyName":result.last_name,
          "givenName":result.first_name
        }
      }
      this.setState({ userInfo:userData });
      this.openIdLogin(userData, "facebook");
    }
  };

  openIdLogin(data,vendor){
    if(data.idToken!="" && data.user.email!="" && data.user.id!=""){
      this.props.fetchData({
        next:'FETCH_USER_OPEN_ID_LOGIN_SUCCESS', 
        rejected:'FETCH_USER_LOGIN_ERROR', 
        method:'POST',
        url:'customer/openid/login', 
        data:{
          "token":data.idToken,
          "email":data.user.email,
          "id":data.user.id,
          "familyName":data.user.familyName,
          "givenName":data.user.givenName,
          "storeId":global.storeId,
          "websiteId":global.websiteId,
          "vendor":vendor,
          "action":"loginOpenId"
        },
        callback:(data, isError)=>{
          this.Loading.hide();
          if(isError){
            setTimeout(() => {
              Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
            }, 100);
          }else{
            this.fetchMineCart();
            if(data.new_user){
              setTimeout(() => {
                Actions.ScanSim({ type: ActionConst.REPLACE, GoHome:true });
              }, 100)
            }else{
              setTimeout(() => {
                this.props.back?Actions.pop():Actions.Home();
              }, 100)
            }
          }
        }
      });
    }else{
      Alert.alert(I18n.t('Email and Password is required'));
    }
  }

  fetchMineCart(){
    let lang = I18n.currentLocale();
    if(this.props.user.user && this.props.user.user.token && this.props.user.user.tokenExpired){
      this.props.fetchData({
        start:'FETCHING_MINE_CART_START',
        next:'FETCHING_MINE_CART_SUCCESS',
        rejected:'FETCHING_MINE_CART_ERROR',
        method:'POST',
        // url:'store/block/21',
        url:'carts/mine',
        data:{
          'lang':lang,
          'token':this.props.user.user.token,
          'tokenExpired':this.props.user.user.tokenExpired
        }
      })
    }
  }

  render() {
    return(
      <View>
        <Text>123133</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Sign_Reg_Box:{
    padding:10,
    margin:10,
    width:120,
    borderWidth:1,
    borderColor:global.styles.textLight2,
    borderRadius:8,
    justifyContent:"center",
    alignItems:'center',
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 0,
  }
})
const mapStateToProps = ({ Lang, user }) => ({ Lang, user });
export default connect(mapStateToProps, { fetchData })(Login);
