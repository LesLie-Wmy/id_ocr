import React, { Component, Fragment } from 'react';
import { 
  View,
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native';
import {Actions} from 'react-native-router-flux'
export default class Statusbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // componentDidMount() {
  //   var aaa = Actions;
  //   console.log(Actions);
  //   this._navListener = this.props.navigation.addListener('didFocus', () => {
  //     StatusBar.setBarStyle(this.props.barStyle?this.props.barStyle:"dark-content");
  //     StatusBar.setBackgroundColor(this.props.backgroundColor?this.props.backgroundColor:'blue'); 
  //   });  
  // }
  
  // componentWillUnmount() {
  //   this._navListener.remove();
  // }


  render() {
    return (
      <SafeAreaView style={{flex:0,marginTop:Platform.OS=='android'?18:0, backgroundColor:this.props.backgroundColor?this.props.backgroundColor:'#fff'}} >
        <StatusBar 
          animated={true}
          hidden={false}
          backgroundColor={this.props.backgroundColor?this.props.backgroundColor:'blue'}
          translucent={true}
          barStyle={this.props.barStyle?this.props.barStyle:"light-content"}
        />
      </SafeAreaView>
    );
  }
}
