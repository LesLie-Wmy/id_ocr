import React, { Component } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  Image
} from 'react-native';
import {
  Container,
  Content,
  Icon
} from 'native-base'
import { connect } from 'react-redux';
import I18n from "../../langs"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import { TextField } from 'react-native-material-textfield';
import { Actions } from 'react-native-router-flux'
import { fetchData } from '../../actions/fetch';
import Loading from '../../component/loading';

import BackgroundImage from '../../component/BackgroundImage';

let win = Dimensions.get("window");

class AccountInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname:'',
      lastname:'',
      email:'',
      password:'',
      password2:'',
      secured:true
    };
  }

  _mailCheck(email){
    if( this.state.name != '' && this.state.email != '' && (this.state.password != '' && (!this.state.secured || this.state.password2 != '') )){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(String(email).toLowerCase())){
        this.Loading.show();
        this.props.fetchData({
          next:'FETCH_ADD_USER_SUCCESS', 
          rejected:'FETCH_ADD_USER_ERROR', 
          method:'POST',
          url:'customer/registration', 
          data:{
            "firstname":this.state.firstname,
            "lastname":this.state.lastname,
            "email":this.state.email,
            "password":this.state.password,
            "storeId":global.storeId,
            "websiteId":global.websiteId,
            "lang":I18n.currentLocale(),
          },
          callback:(data, isError)=>{
            this.Loading.hide();
            if(isError){
              setTimeout(() => {
                Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
              }, 100);
            }else{
              setTimeout(() => {
                Actions.RegConfirm({"email":this.state.email,"password":this.state.password});
              }, 100)
            }
          }
        });
        //Actions.RegConfirm({"email":this.state.email})
      }else{
        Alert.alert(I18n.t("Warning"), I18n.t("Email not correct"))
      }
    }else{
      Alert.alert(I18n.t("Warning"), I18n.t("Please fill in Name, Email and Password"))
    }
  }

  render() {
    let { firstname, lastname, email, password } = this.state;
    return (
      <Container style={{flex:1, justifyContent:'flex-end', backgroundColor:global.colors.background.root}}>
        <BackgroundImage style={{position:'absolute', top:-40 * global.scale, left:0, right:0, bottom:0}} source={require('../../images/Login.png')} />
        <Statusbar
          backgroundColor={'#00000000'}
          barStyle="dark-content"
          />
        <MyHeader title={I18n.t("Register")} titleColor={global.styles.headerTxt} />
        <Loading ref={(Loading) => this.Loading = Loading} />
        
        <Content style={{ flex:1 }}  >
            <View style={{ flex:1, alignItems:"center" }}>
              <View style={{height:110 * global.scale}} />
              <View style={{justifyContent:"flex-end", width:300}}>            
                <TextField 
                  placeholder={I18n.t("Firstname")} 
                  placeholderTextColor="#666"
                  value={this.state.firstname} 
                  onChangeText={ (firstname) => this.setState({ firstname }) }
                  onSubmitEditing={()=>this.refs.lastname.focus()}
                  style={global.styleSheet.input1}
                  />
                <TextField 
                  placeholder={I18n.t("Lastname")} 
                  placeholderTextColor="#666"
                  value={this.state.lastname} 
                  ref="lastname"
                  onChangeText={ (lastname) => this.setState({ lastname }) }
                  onSubmitEditing={()=>this.refs.email.focus()}
                  style={global.styleSheet.input1}
                  />
                <TextField 
                  placeholder={I18n.t("Email")} 
                  placeholderTextColor="#666"
                  value={this.state.email} 
                  onChangeText={ (email) => this.setState({ email }) }
                  ref="email"
                  keyboardType="email-address"
                  onSubmitEditing={()=>this.refs.Password.focus()}
                  style={global.styleSheet.input1}
                  />
                <View>
                  <TextField 
                    secureTextEntry={this.state.secured}
                    placeholderTextColor="#666"
                    placeholder={I18n.t("Password")} 
                    value={this.state.password} 
                    onChangeText={ (password) => this.setState({ password }) }
                    ref="Password"
                    multiline={false}
                    // onSubmitEditing={()=>this._mailCheck(this.state.email)}
                    style={[global.styleSheet.input1, {paddingRight:40}]}
                    />    
                    <View
                      style={{ alignItems:'center', justifyContent:'center',marginTop:7 }}
                      >
                      <TouchableOpacity 
                        onPress={()=>this.setState({secured:!this.state.secured})}
                        style={{ position:'absolute',  right:5, bottom:-0, alignItems:'center', justifyContent:'center' }}
                        >
                        <Icon type='AntDesign' name="eyeo" style={{fontSize: 32, color: this.state.secured?"#ccc":"#00f", marginRight:2, }}/>
                      </TouchableOpacity>
                    </View> 
                </View>
                {
                  this.state.secured
                  ?
                  <TextField 
                    placeholderTextColor="#666"
                    placeholder={I18n.t("Confirm Password")} 
                    value={this.state.password2} 
                    onChangeText={ (password2) => this.setState({ password2 }) }
                    ref="Password"
                    multiline={false}
                    // onSubmitEditing={()=>this._mailCheck(this.state.email)}
                    style={[global.styleSheet.input1, {paddingRight:40}]}
                    /> 
                  :
                  null
                }
                
              </View>
              <View style={{width:200, alignSelf:'center'}}>
              {
                this.state.lastname!='' && this.state.firstname!='' && this.state.password!='' ?
                <TouchableOpacity style={ [styles.testBox, {backgroundColor:global.colors.text.t2}]} onPress={ () => this._mailCheck(this.state.email)}>
                  <Text style={{ color:global.colors.text.t1, fontSize:18}}>{I18n.t('Register Now')}</Text>
                </TouchableOpacity>:
                <View style={ styles.testBox}>
                  <Text style={{ color:global.colors.text.t1, fontSize:18}}>{I18n.t('Register Now')}</Text>
                </View>
              }
              </View>

            </View>

            <View style={{height:30 * global.scale}} />
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  testBox:{
    padding:20,
    marginTop:70,
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:global.colors.btn.register,
  }
})

export default connect(null, { fetchData })(AccountInformation);