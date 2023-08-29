import React, { Component } from 'react';
import { 
  View,
  Text,
  Alert,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Container,
  Content
} from 'native-base'
import { connect } from 'react-redux';
import { fetchingData } from '../../actions/fetch';
import I18n from "../../langs"
import { MyHeader } from '../../component/MyHeader'
import CodeInput from 'react-native-confirmation-code-field';
import { Actions, ActionConst } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Statusbar from '../../component/Statusbar'
import Loading from '../../component/loading';

import BackgroundImage from '../../component/BackgroundImage';
import { timeInterval } from 'rxjs/operators';

let win = Dimensions.get("window");

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "timeLeft":0,
    };
  }

  onSkip(){
    Actions.Home();
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'flex-end', backgroundColor:'#E1E1E1'}}>
        <BackgroundImage  source={require('../../images/Welcome.png')} />
        <Statusbar
          backgroundColor={'#00000000'}
          barStyle="dark-content"
          />
        <MyHeader title={I18n.t('Congratulations')} titleColor={global.styles.headerTxt} />
        <Loading ref={(Loading) => this.Loading = Loading} />
        
        
        <View style={{ height:win.height, justifyContent:'center', alignItems:"center" }}>
          <View style={{flex:1}}>
            <View style={{marginTop:win.height * 0.25 + win.height * 0.25 * ( Math.abs (1 - 896/win.height)), borderBottomColor:'#8ACF45', borderBottomWidth:2, paddingBottom:10}}>
              <Text style={{fontSize:30, color:'#5933A7', fontWeight:'bold'}}>{I18n.t('Welcome to join our family')}</Text>
            </View>
          </View> 
          
          <TouchableOpacity 
            onPress={()=>this.onSkip()}
            style={ [styles.testBox] } 
            >
            <Text style={{ fontSize:16, color:global.colors.text.t1, }}>{I18n.t('Start Now')}</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row:{
    backgroundColor:global.colors.background.root,
    padding:20,
    borderRadius:40,
    shadowOffset: {width: 0,height: 2,}, 
    shadowOpacity: 0.23, 
    shadowRadius: 2.62, 
    elevation: 4,
    flexDirection:'row',
    width:'94%'
  },
  testBox:{
    padding:20,
    marginTop:20,
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:'#8ACF45',
    width:'40%',
  }
})

const mapStateToProps = ({ user, Lang }) => ({ user, Lang });
export default connect(mapStateToProps, { fetchingData })(Welcome);