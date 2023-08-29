import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  Platform,
  PixelRatio,
} from 'react-native';
import MyIcon from './icon-font.js';

export class TabIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let image;
    let styles;
    let imageSize;
    let focused = !this.props.focused;


    
    styles = { borderWidth:0, marginTop:5 };
    imageSize = { width:45, height:45 };
    switch (this.props.title) {
        case 'Shop':
          rowStyles = { borderWidth:0, marginTop:5 };
          styles={color:focused ? global.styles.text3:global.styles.body, fontWeight: '600', fontSize:30, marginBottom:10}
          image = focused ? require('../images/menuicon_shop.png') : require('../images/menuicon_shop_active.png');
          break;

        case 'Sim':
          rowStyles = { borderWidth:0, marginTop:10 };
          styles={color:focused ? global.styles.text3:global.styles.body, fontWeight: '600', fontSize:40, marginBottom:13}
          image = focused ? require('../images/menuicon_country.png') : require('../images/menuicon_country_active.png');
          break;

        case 'Home':
          rowStyles = { borderWidth:0 };
          styles={color:focused ? global.styles.text3:global.styles.body, fontWeight: '600', fontSize:Platform.OS=='ios'?60:60, marginBottom:Platform.OS=='ios'?18/global.scale:18}
          imageSize = { width:70, height:70 };
          image = focused ? require('../images/menuicon_home.png') : require('../images/menuicon_home_active.png');
          break;

        case 'Me':
          rowStyles = { borderWidth:0, marginTop:5 };
          styles={color:focused ? global.styles.text3:global.styles.body, fontWeight: '600', fontSize:30, marginBottom:10}
          image = focused ? require('../images/menuicon_cart.png') : require('../images/menuicon_cart_active.png');
          break;

        case 'More':
          rowStyles = { borderWidth:0, marginTop:10 };
          styles={color:focused ? global.styles.text3:global.styles.body, fontWeight: '600', fontSize:40, marginBottom:10}
          image = focused ? require('../images/menuicon_setting.png') : require('../images/menuicon_setting_active.png');
          break;
    }
    return (
      // <View style={rowStyles}>
      //   <MyIcon name={this.props.title.toLowerCase()} style={styles}/>
      // </View>
      <View style={styles}>
        <ImageBackground source={image} style={imageSize}/>
      </View>
    );
  }
}

// export class HotPackIcon extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <View style={{ borderWidth:0, marginBottom:marginB }}>
//         <ImageBackground source={require("../images/home.png")} style={{ width:60, height:60, zIndex:999}} />
//       </View>
//     )
//   }
// }

// export class MyAccountIcon extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <View style={{ borderWidth:0, marginBottom:0 }}>
//         <ImageBackground source={require("../images/me.png")} style={{ width:sizeW, height:sizeH,}} />
//       </View>
//     )
//   }
// }

// export class SettingIcon extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <View style={{ borderWidth:0, marginBottom:0 }}>
//         <ImageBackground source={require("../images/more.png")} style={{ width:sizeW, height:sizeH,}} />
//       </View>
//     )
//   }
// }

// export class PackageIcon extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <View style={{ borderWidth:0, marginBottom:0 }}>
//         <ImageBackground source={require("../images/local.png")} style={{ width:sizeW, height:sizeH,}} />
//       </View>
//     )
//   }
// }

export default TabIcon;