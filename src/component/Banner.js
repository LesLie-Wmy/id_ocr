import React, { Component } from 'react';
import {   
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  // Image,
  StyleSheet
} from 'react-native';
const win = Dimensions.get("window")
import Image from "./ResponsiveImage";
export class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity||0.7}
          style={[styles.container, this.props.containerStyle]}
        >
          <Image 
            source={this.props.banner} 
            resizeMode={this.props.resizeMode?this.props.resizeMode:'contain'} 
            style={{ borderRadius:6, ...this.props.style, width:'100%'}}
            />
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:6,
    overflow:"hidden",
    margin: 5,
  }
});

export default Banner