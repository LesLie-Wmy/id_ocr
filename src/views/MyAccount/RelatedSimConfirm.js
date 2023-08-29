//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
} from 'native-base'
import { fetchingData } from '../../actions/fetch';
import { connect } from 'react-redux';
import CodeInput from 'react-native-confirmation-code-field';
import I18n from "../../langs"
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import Loading from '../../component/loading'

// create a component
class RelatedSimConfirm extends Component {
  constructor(props){
    super(props);
    this.state={
      email:this.props.email,
      password:this.props.password,
      phone:this.props.phone,
      nickname:this.props.nickname
    }
  }

  OnFulfill(code){

  }

  render() {
    return (
      <Container style={styles.container}>
        <Statusbar backgroundColor={global.colors.background.statusBar} />
        <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader 
            title=''
            titleColor={global.styles.headerTxt}
          />
        </View>
        <Loading/>
        <Content>
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:26,color:global.styles.text1, marginTop:10, marginBottom:15, fontWeight:'600'}}>{I18n.t('Confirm')}</Text>
            
              <Text style={{fontSize:20,color:global.styles.text1}}>{I18n.t('A Confirm Code is already sent to')}</Text>
              <Text style={{fontSize:22,color:global.styles.text1}}>{this.props.phone}</Text>
              <Text style={{fontSize:20,color:global.styles.text1, marginBottom:10, marginTop:20}}>{I18n.t('Please get it back and fill it in confirm box')}</Text>
          </View>
          <View>
            <CodeInput 
              style={{color:global.styles.text2, fontSize:22}}
              size={50}
              ref="refName" 
              autoFocus={false} 
              activeColor={global.styles.headerTxt}
              inactiveColor={global.styles.textLight2}
              codeLength={5} 
              keyboardType="numeric"
              // compareWithCode={"12345"} 
              onFulfill={code => this.OnFulfill(code)} />
          </View>
          <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop:20}}>
            <Text style={{fontSize:20,color:global.styles.textLight2}}>--------------- {I18n.t('OR')} ---------------</Text>
            <Text style={{fontSize:20,color:global.styles.textLight2}}>{I18n.t('You can fill it later')}</Text>
            <Image source={require('../../images/verify_later.png')} style={{width:200, height:200}} />
          </View>
        </Content>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:global.colors.background.statusBar,
  },
});

//make this component available to the app
export default connect(null, { fetchingData })(RelatedSimConfirm);
