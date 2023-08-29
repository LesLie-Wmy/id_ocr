//import liraries
import React, { Component } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  Dimensions
 } from "react-native";

 const win = Dimensions.get('window');

// create a component
class BackgroundImage extends Component {
  render() {
    return <Image style={[styles.container,this.props.style?this.props.style:{}]} source={this.props.source} resizeMode='cover' />;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width:win.width,
    left:0,
    top: 0,
  }
});

//make this component available to the app
export default BackgroundImage;
