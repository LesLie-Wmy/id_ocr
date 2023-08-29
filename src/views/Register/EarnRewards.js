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
  Clipboard
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

import Toast, {DURATION} from 'react-native-easy-toast'

let win = Dimensions.get("window");

class EarnRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "timeLeft":0,
    };
  }

  onSkip(){
    Actions.Welcome();
  }

  _setContent() {
    Clipboard.setString(I18n.t('Hello here is my referral code %{s1} copy it and paste it on VeeroamSim App you can earn %{s2} points', {s1:this.props.user.user.custom_attributes.user_code, s2:10}));
    this.refs.toast.show(I18n.t('Copied'));
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'flex-end', backgroundColor:'#E1E1E1'}}>
        <BackgroundImage source={require('../../images/Login.png')} />
        <BackgroundImage style={{marginTop:100 * (1 - (896/win.height))}} source={require('../../images/Login.png')} />
        <Statusbar
          backgroundColor={'#00000000'}
          barStyle="dark-content"
          />
        <MyHeader title={I18n.t('Congratulations')} titleColor={global.styles.headerTxt} />
        <Loading ref={(Loading) => this.Loading = Loading} />
        
        <View>
        <View style={{ height:win.height, justifyContent:'center', alignItems:"center" }}>
          <View style={{height:'30%'}} /> 
          <View style={{ justifyContent:'center', alignItems:"center" }}>
            {
              this.props.skip
              ?
              <View/>
              :
              <View style={{width:2, height:'100%', backgroundColor:'#B8B8B8', position:'absolute', top:0}} />
            }
            
            {
              this.props.skip
              ?
              <View/>
              :
              <View style={styles.row} >
                <Image source={require('../../images/icon_referral_add.png')} style={{width:32, height:33}} />
                <View style={{flex:1, justifyContent:'center', alignItems:"center"}}>
                  <Text >
                    {I18n.t('%{s} added to your account', {s:10})}
                  </Text>
                </View>
              </View>
            }

            {
              this.props.skip
              ?
              <View/>
              :
              <View style={[styles.row, {marginTop:20}]} >
                <Image source={require('../../images/icon_referral_point_add.png')} style={{width:50, height:32}} />
                <View style={{flex:1, justifyContent:'center', alignItems:"center"}}>
                  <Text >
                    {I18n.t('Your friend earn %{s} points', {s:50})}
                  </Text>
                </View>
              </View>
            }

            <View style={[styles.row, { marginTop:20, justifyContent:'center', alignItems:"center"}]} >
              <Image source={require('../../images/icon_point_max.png')} style={{width:34, height:30}} />
              <View style={{flex:1, justifyContent:'center', alignItems:"center"}}>
                <Text style={{textAlign:'center'}}>{I18n.t('Take action now, to earn more points')}{I18n.t('Invite friends, earn free points, get more free products')}</Text>
              </View>
              <Image source={require('../../images/icon_point_max.png')} style={{width:34, height:30}} />
            </View>
          </View>

          <View style={[styles.row, {width:'70%', padding:10, borderRadius:5, marginTop:20, justifyContent:'center', alignItems:"center"}]} >
            <TouchableOpacity 
              style={{flexDirection:'column', justifyContent:'center', alignItems:"center"}}
              onPress={()=>this._setContent()}
              >
              <Image source={require('../../images/btn_copy.png')} style={{width:40, height:40}} />
              <Text style={{color:'#B1B1B1'}}>
                {I18n.t('Copy')}
              </Text>
            </TouchableOpacity>
            <View style={{flex:1, justifyContent:'center', alignItems:"center"}}>
              <Text style={{textAlign:'center', fontSize:18, color:global.colors.text.a2}}>{I18n.t('Your Referral Code')}</Text>
              <Text style={{textAlign:'center', fontSize:19, marginTop:6, fontWeight:'bold', color:global.colors.text.t2}}>{this.props.user.user.custom_attributes.user_code}</Text>
            </View>
            <TouchableOpacity style={{flexDirection:'column', justifyContent:'center', alignItems:"center"}}>
              <Image source={require('../../images/btn_share.png')} style={{width:40, height:40}} />
              <Text style={{color:'#B1B1B1'}}>
                {I18n.t('Share')}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            onPress={()=>this.onSkip()}
            style={ [styles.testBox] } 
            >
            <Text style={{ fontSize:16, color:global.colors.text.t1, }}>{I18n.t('Skip')}</Text>
          </TouchableOpacity>
        </View>
        
        </View>
        <Toast 
          ref="toast" 
          defaultCloseDelay={2000}
          position='bottom'
          opacity={0.8}
        />
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
    backgroundColor:global.colors.btn.register,
    width:'40%',
  }
})

const mapStateToProps = ({ user, Lang }) => ({ user, Lang });
export default connect(mapStateToProps, { fetchingData })(EarnRewards);