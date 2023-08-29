import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList
} from 'react-native';
import {
  Container,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Card
} from 'native-base'
import ImagePicker from 'react-native-image-picker';
import Statusbar from '../../component/Statusbar';
import { connect } from 'react-redux'
import MyHeader from '../../component/MyHeader'
import SelectLanguage from '../../component/SelectLanguage'
import { Actions } from 'react-native-router-flux'
import I18n from 'react-native-i18n'
import { logoutUser } from '../../actions/login'

import DataChart from '../MyAccount/DataChart';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
  },
};

export class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _LanguageSelection() {
    this.refs.selectLanguage._showLanguageSelection()
  }

  _ToLang(lang) {
    switch (lang) {
      case 'en-US':
        return "English"
      case 'zhHant':
        return "中文(繁體)"
      case 'zhHans':
        return "中文(簡体)"
      default:
        return "Language"
    }
  }

  LogoutUser() {
    if (this.props.user.login) {
      Alert.alert(I18n.t('logout') + "?", "", [
        { text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: I18n.t('YES'), onPress: () => {
            this.props.logoutUser();
            // console.log(FBLoginManager)
            // FBLoginManager.logout(function(e){
            //   console.log(e)});
            Actions.Login();
          }
        },
      ])
    } else {
      this.props.logoutUser();
      Actions.Login();
    }

  }

  renderBox({ item, index }) {
    return (
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={item.onPress}
      >
        <Card key={index} style={{ width: '85%', margin: 0, padding: 0, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: item.backgroundColor ? item.backgroundColor : '#fff' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
            <Image source={item.source} resizeMode='center' style={{ width: 49 * global.scale, height: 49 * global.scale }} />
            <Text style={{ color: global.colors.text.d1, fontSize: 14 * global.scale, marginTop: 10, textAlign: 'center' }}>{item.name}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    )

  }

  _ImagePicker() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {
    I18n.locale = this.props.Lang.lang;

    this.itemList = [
      {
        name: I18n.t('About us'),
        source: require('../../images/More_icon_about.png'),
        onPress: () => console.log('About Us'),
      },
      {
        name: I18n.t("ContactUs"),
        source: require('../../images/More_icon_contact.png'),
        onPress: () => Actions.ContactUs(),
      },
      {
        name: I18n.t('Terms & Conditions'),
        source: require('../../images/More_icon_tc.png'),
        onPress: () => Actions.ContactUs(),
      },
      {
        name: I18n.t('FAQs'),
        source: require('../../images/More_icon_qa.png'),
        onPress: () => Actions.ContactUs(),
      },
      {
        name: I18n.t('Language'),
        source: require('../../images/More_icon_lang.png'),
        onPress: () => this._LanguageSelection(),
      },
      {
        name: this.props.user.login ? I18n.t('logout') : I18n.t('Sign-In'),
        source: this.props.user.login ? require('../../images/More_icon_login.png') : require('../../images/More_icon_regsiter.png'),
        onPress: () => this.LogoutUser(),
        backgroundColor: this.props.user.login ? '#fff' : global.colors.text.a1,
        textColor: this.props.user.login ? global.colors.text.d1 : global.colors.text.t1,
      },
    ];

    if (this.props.user.login) {
      this.itemListLogin = [
        // {
        //   name:I18n.t('Daily Bonus'),
        //   source:require('../../images/More_icon_daily.png'),
        //   onPress: () => Actions.RewardSignIn(),
        // },
        // {
        //   name:I18n.t('RelatedSim'),
        //   source:require('../../images/More_icon_related.png'),
        //   onPress: () => Actions.RelatedSim(),
        // },

        {
          name: I18n.t('AddressBook'),
          source: require('../../images/More_icon_adderss.png'),
          onPress: () => Actions.AddressBook(),
        },
        {
          name: I18n.t('OrderHistory'),
          source: require('../../images/More_icon_history.png'),
          onPress: () => Actions.OrderHistory(),
        },
        {
          name: I18n.t('WishList'),
          source: require('../../images/More_icon_whiteList.png'),
          onPress: () => Actions.WishList(),
        },
        {
          name: I18n.t('Invite'),
          source: require('../../images/More_icon_invite.png'),
          onPress: () => Actions.Invite({ code: this.props.user.user.ref_no }),
        },
      ];
      // Array.prototype.push.apply(this.itemList,this.itemListLogin);
      this.itemList = [...this.itemListLogin, ...this.itemList];
    }
    let fbid = [];
    if (this.props.user.user.email)
      fbid = this.props.user.user.email.split("@facebook.com");
    return (
      <Container style={{ backgroundColor: '#FBFBFB' }}>
        <Statusbar backgroundColor={global.colors.background.statusBar} />
        <SelectLanguage ref="selectLanguage" modalVisible={false} />
        {
          this.props.user.login ?
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 0 }}>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderRadius: 80, width: 120 * global.scale, height: 120 * global.scale, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} onPress={() => this._ImagePicker()}>
                {
                  this.state.avatarSource ?
                    <Image source={this.state.avatarSource} style={{ borderRadius: 60, width: 120 * global.scale, height: 120 * global.scale, marginTop: 20 * global.scale }} />
                    :
                    <Image source={require("../../images/menuicon_info.png")} style={{ width: 120 * global.scale, height: 120 * global.scale, marginTop: 20 }} />
                }
              </TouchableOpacity>
              <View style={{ marginLeft: 0, alignItems: 'flex-start', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 30, overflow: 'hidden' }} >
                    <Icon type="AntDesign" name="user" style={{ color: global.styles.textDark1, fontSize: 20 * global.scale, margin: 7 }} />
                  </View>
                  <Text style={{ fontSize: 16 * global.scale, marginLeft: 5, textDecorationLine: 'none', color: global.styles.textDark1, fontWeight: '600' }}>{this.props.user.user.firstname} {this.props.user.user.lastname}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 30, overflow: 'hidden' }} >
                    {
                      fbid.length > 1 ?
                        <Icon type="AntDesign" name="facebook-square" style={{ color: global.styles.textDark1, fontSize: 20 * global.scale, margin: 7 }} />
                        :
                        <Icon type="AntDesign" name="mail" style={{ color: global.styles.textDark1, fontSize: 20 * global.scale, margin: 7 }} />
                    }

                  </View>
                  <Text style={{ fontSize: 15 * global.scale, marginLeft: 5, textDecorationLine: 'none', color: global.styles.textDark1, fontWeight: '600' }}>{fbid.length > 1 ? fbid[0] : this.props.user.user.email}</Text>
                </View>
                {
                  this.props.user.user.points ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../images/icon_phone-1.png')} style={{ width: 40, height: 40 }} />
                      <Text style={{ fontSize: 15, color: global.styles.textDark1, fontWeight: '600', marginTop: 5 }}>{I18n.t('Phone')} : {this.props.user.user.telephone}</Text>
                    </View>
                    :
                    null
                }
                {
                  this.props.user.user.points ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../images/icon_point.png')} style={{ width: 40, height: 40 }} />
                      <Text style={{ fontSize: 15, color: global.styles.textDark1, fontWeight: '600', marginTop: 5 }}>{I18n.t('Balance')} : </Text>
                      <Text style={{ fontSize: 15, color: global.styles.textDark1, fontWeight: '600', marginTop: 5 }}>{global.NumberFormat(parseInt(this.props.user.user.points))}</Text>
                    </View>
                    :
                    null
                }

              </View>
            </View>
            :
            null
        }
        {
          this.props.user.login ?
            <View style={{ alignItems: 'center', marginTop: 2 }}>
              <Image source={require('../../images/barLine1.png')} resizeMode="stretch" style={{ width: "100%", height: 1 }} />
            </View>
            :
            null
        }
        <View style={{ flex: 1, marginTop: 2 }}>
          <FlatList
            ListHeaderComponent={
              <View style={{ marginTop: 0, marginBottom: 10 }}>
                {
                  this.props.user.login && this.props.user.user && this.props.user.user.custom_attributes && typeof (this.props.user.user.custom_attributes.iccid) != 'undefined' && this.props.user.user.custom_attributes.iccid.length > 0 ?
                    <View>
                      {/* <DataChart ref='dateChart' r={100} style={{marginTop:10}} max={400} value={40} backgroundBarColor="#E4E4E4" barColor="#8ACF45" /> */}
                      <TouchableOpacity
                        style={{ flex: 1, marginTop: 20, paddingTop: 10, paddingBottom: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: global.styles.card }}
                        onPress={() => { Actions.ScanSim({ no_skip: true }) }}
                      >
                        <Text style={{ fontSize: 22, color: global.styles.text, fontWeight: '600' }}>{I18n.t('No eFun Sim Added')}</Text>
                        <Text style={{ fontSize: 20, color: global.styles.btn, fontWeight: '600' }}>{I18n.t('Press to add eFun Sim')}</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    null
                }
                {
                  this.props.user.user && this.props.user.user.custom_attributes && typeof (this.props.user.user.custom_attributes.iccid) != 'undefined' && this.props.user.user.custom_attributes.iccid.length > 0 ?
                    <View>
                      {/* <TouchableOpacity 
                    style={{position:'absolute', top:'10%', right:'15%'}}
                    onPress={()=>{this.props.onSelectMySim(); Actions.Sim()}}
                    >
                      <Icon type='EvilIcons' name="plus" style={{fontSize: 40, color: '#8ACF45', marginLeft:0, marginTop:5}}/>
                  </TouchableOpacity> */}
                    </View>
                    : null
                }
              </View>
            }
            contentContainerStyle={{ paddingBottom: 30 }}
            data={this.itemList}
            renderItem={(data) => this.renderBox(data)}
            numColumns={3}
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = ({ Lang, user }) => ({ Lang, user })
export default connect(mapStateToProps, { logoutUser, onSelectMySim })(More)