import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Keyboard
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Icon,
  Header,
  Item,
  Button,
  Input,
  Spinner
} from 'native-base'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import SplashScreen from 'react-native-smart-splash-screen';

import Carousel from 'react-native-banner-carousel';
import I18n from '../../langs'

import { fetchData} from '../../actions/fetch'

import Statusbar from '../../component/Statusbar';
import {LoadingWithoutModal} from '../../component/LoadingWithoutModal';


var moment = require('moment');

const BannerWidth = Dimensions.get('window').width;
const win = Dimensions.get("window")
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner:false,
    };
  }

  componentDidMount(){
    SplashScreen.close({
      animationType: SplashScreen.animationType.scale,
      duration: 850,
      delay: 500,
      bounces: false
    })
  }

  componentDidUpdate(prevProps) {
      console.log("updated");
  }
  

  componentWillReceiveProps(props){
    console.log(props);
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
  list_container:{
    alignItems:'stretch',
    justifyContent:'center',
    paddingBottom: 30,
    backgroundColor:global.colors.background.homeProductRow
  },
  separator:{
    height:10,
    width: '100%',
    backgroundColor:'white',
    borderBottomWidth:.5,
    borderColor:'lightgrey'
  },
})

const mapStateToProps = ({ homeCategory, user }) => ({ homeCategory, user });
export default connect( mapStateToProps, { fetchData, UpdateRenderCategory })(Home);