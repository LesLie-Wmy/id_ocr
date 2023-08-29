import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Container,
  Content,
  Icon,
} from 'native-base'
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import I18n from '../../langs'
import { TextField } from 'react-native-material-textfield';

const win = Dimensions.get("window");


export default class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      phone:'',
      content:'',
      code:'',
    };
    this.code = (Math.random()*10).toString().slice(2,6)
  }
  
  onSubmit(){
    let msg;
    if(this.state.name==''){
      msg = "ContactName";
    }else if(this.state.email==''){
      msg = "ContactEmail";
    }else if(this.state.phone==''){
      msg = "ContactPhone";
    }else if(this.state.content==''){
      msg = "Content";
    }else if(this.state.code==''){
      msg = "VerifyCode";
    }else if(this.state.code!=this.code){
      Alert.alert(I18n.t("Please check Verify Code"));
      return false;
    }else{

      return true;
    }

    Alert.alert(I18n.t(msg)+I18n.t("can't empty"));
    return false;
  }

  render() {
    return (
      <Container style={{ backgroundColor:global.styles.body,}}>
        <Statusbar backgroundColor={global.colors.background.statusBar} />
        <View style={{ backgroundColor:global.colors.background.statusBar }}>
          <MyHeader 
            title={I18n.t('ContactUs')}
            titleColor={global.styles.headerTxt}
          />
        </View>
        <Content>
          <View style={{marginTop:20, marginLeft:"10%"}}>
            <View style={{borderWidth:0,width:'90%'}}>
              <TextField 
                label={I18n.t("ContactName")} 
                tintColor={global.styles.text1}
                baseColor={global.styles.text1}
                inputContainerStyle={{
                  borderBottomColor:global.styles.textDark1
                }}
                value={this.state.name} 
                onChangeText={ (name) => this.setState({ name }) }
                onSubmitEditing={()=>this.refs.contact_phone.focus()}
                />
            </View>
            <View style={{borderWidth:0,width:'90%'}}>
              <TextField 
                ref="contact_phone"
                label={I18n.t("ContactPhone")} 
                tintColor={global.styles.text1}
                baseColor={global.styles.text1}
                inputContainerStyle={{
                  borderBottomColor:global.styles.textDark1
                }}
                value={this.state.phone} 
                onChangeText={ (phone) => this.setState({ phone }) }
                onSubmitEditing={()=>this.refs.email.focus()}
                keyboardType={'phone-pad'}
                />
            </View>
            <View style={{borderWidth:0,width:'90%'}}>
              <TextField 
                ref="email"
                label={I18n.t("ContactEmail")} 
                tintColor={global.styles.text1}
                baseColor={global.styles.text1}
                inputContainerStyle={{
                  borderBottomColor:global.styles.textDark1
                }}
                value={this.state.email} 
                onChangeText={ (email) => this.setState({ email }) }
                onSubmitEditing={()=>this.refs.content.focus()}
                keyboardType={'email-address'}
                />
            </View>
            <View style={{borderWidth:0,width:'90%'}}>
                <TextField
                  ref="content"
                  tintColor={global.styles.text1}
                  baseColor={global.styles.text1}
                  inputContainerStyle={{
                    borderBottomColor:global.styles.textDark1,
                    minHeight:150
                  }}
                  containerStyle={{minHeight:150}}
                  label={I18n.t("Content")}
                  // containerStyle={{height:150}}
                  // inputContainerStyle={{height:150}}
                  value={this.state.content} 
                  // inputStyleOverrides={{maxHeight:130}}
                  onChangeText={ (content) => this.setState({ content }) }
                  multiline={true}
                  numberOfLines={6}
                  // onSubmitEditing={()=>this.refs.email.focus()}asa
                  />
            </View>
            
            <View style={{width:'90%',flexDirection:'row', marginTop:20, alignItems:'center'}}>
              <View style={{flex:1, marginRight:10}}>
                <TextField
                    label={I18n.t("VerifyCode")}
                    tintColor={global.styles.text1}
                    baseColor={global.styles.text1}
                    inputContainerStyle={{
                      borderBottomColor:global.styles.textDark1
                    }}
                    keyboardType={'numeric'}
                    value={this.state.code} 
                    onChangeText={ (code) => this.setState({ code }) }
                    onSubmitEditing={()=>this.onSubmit()}
                    />
              </View>
              <View style={{padding:10, paddingBottom:2, paddingTop:2, borderColor:global.styles.textLight1, borderRadius:2, borderWidth:2}}>
                <Text style={{color:global.styles.textLight4, fontSize:20, fontWeight:'800'}}>{this.code}</Text>
              </View>
            </View>

            <View style={{width:'90%', alignItems:'center', marginTop:30, marginBottom:30}}>
              <TouchableOpacity style={{borderColor:global.styles.textLight4, borderRadius:5, borderWidth:2}} onPress={()=>this.onSubmit()}>
                <Text style={{margin:5, marginLeft:50,marginRight:50, fontSize:18, color:global.styles.text1, fontWeight:'400'}}>{I18n.t('Submit')}</Text>
              </TouchableOpacity>
            </View>

            
          </View>
        </Content>
      </Container>
    );
  }
}