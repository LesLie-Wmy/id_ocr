import React, { Component } from 'react'
import {SafeAreaView, Dimensions, Platform, BackHandler, Alert} from "react-native"

import { Provider, connect } from 'react-redux'
import { Scene, Router, Lightbox, Actions, ActionConst} from 'react-native-router-flux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import OneSignal from 'react-native-onesignal';
import MyTabBar from '../component/MyTabBar';

// redux-observable
import { createEpicMiddleware } from 'redux-observable';

console.disableYellowBox = true;

import I18n from '../langs'
import configureStore from './configureStore';
const { persistor, store } = configureStore();
import SplashScreen from 'react-native-smart-splash-screen';


const RouterWithRedux = connect()(Router)
import { TabIcon } from '../component/TabIcon'
import Home from './Home'
import Login from './Login'
import More from './More'
import AccountInformation from './Register/accountInformation'


export default class HKWalkerSim extends Component {
  constructor(props){
    super(props);
    this.state={
      isLoadin:false
    }
    OneSignal.init("699df5fa-ac80-4bd2-ae9f-1355bde6ca79", {kOSSettingsKeyAutoPrompt : true});// set kOSSettingsKeyAutoPrompt to false prompting manually on iOS

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  setLoging(store){
    //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
    SplashScreen.close({
      animationType: SplashScreen.animationType.scale,
      duration: 850,
      delay: 1000,
    })

    if(store.getState().Lang.lang){
      I18n.locale = store.getState().Lang.lang;
    }else{
      let langArr = I18n.currentLocale().split('-');
      let lang="";
      langArr.forEach((e,i) => {
        if(i<2)
          lang+=e;
      });
      let langIndex;
      switch (lang) {
        case 'zhHant':
          langIndex=1;
          break;
        case 'zhHans':
            langIndex=2;
            break;
        default:
          langIndex=0;
          break;
      }
      store.dispatch( { type: 'SET_LANG', payload:{index:langIndex,langType:lang} });
    }

    if(store.getState().user && (store.getState().user.login || store.getState().user.skipLogin)){
      this.setState({
        isLoadin:true
      })
      console.log('onBeforeLift');
    }
  }

  tabBarOnPress(e){
    console.log('onEnterView', e);
    const routeName = e.navigation.state.key;
    e.navigation.navigate(e.navigation.state.routeName);
  }

  exitApp(){
    this.timer && clearTimeout(this.timer);
    BackHandler.removeEventListener();
    BackHandler.exitApp()
  }
  
  handleBackPress = () => {
    console.log("BackHandler","index:" + Actions.state.index);
    if(Actions.state.routes[0].routes.length == 1 && Actions.state.routes[0].routes[0].index==2){
        Alert.alert(
          "",
          I18n.t("Do you want to leave?"),
          [
              {text: I18n.t('Cancel'), onPress: () => console.log('OK Pressed!')},
              {text: I18n.t('YES'), onPress: () => this.exitApp()},
          ], 
          { cancelable: false }
        );
    }else{
      Actions.pop();
    }
    return true;
  }

  render() {
      const { persistor, store } = configureStore();
      return (
        <Provider store={store}>
          <PersistGate 
              loading={null} 
              persistor={persistor}
              onBeforeLift={()=>this.setLoging(store)}
            >
            <RouterWithRedux
              backAndroidHandler={this.handleBackPress}
            >
              <Lightbox>
                <Scene key="root"> 
                
                  <Scene key="tabbar" tabs showLabel={false} hideTabBar={false} key="Main" tabBarPosition='bottom' hideNavBar={true} /*lazy={true} */ tabBarComponent={MyTabBar} default='Home' activeTintColor="#EA986C"  type={ActionConst.RESET}>
                    <Scene tabs={true} hideTabBar={false} key="Home" component={Home} title="Home" icon={TabIcon} hideNavBar={true} showDot={true} initial={this.state.isLoadin} />
                    <Scene tabs={true} hideTabBar={false} key="More" component={More} title="More" icon={TabIcon} hideNavBar={true} showDot={true}/>
                  </Scene>

                  <Scene key="Login" component={Login} title="Login" hideNavBar={true}  initial={!this.state.isLoadin} />
                  <Scene key="AccountInformation" component={AccountInformation} title="AccountInformation" hideNavBar={true} />
                </Scene>
              </Lightbox>
            </RouterWithRedux>
          </PersistGate>
        </Provider>
      );
  }
}




