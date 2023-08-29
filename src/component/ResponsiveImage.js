import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import ImageLoaderBase64 from './ImageLoaderBase64'
 
var win = Dimensions.get('window');
var scale;
 
class Image extends Component {
  render() { 
    if(Platform.OS=="android"){
      if (win.width <= 414) { 
        scale = win.width / 414;
      } else{
        scale = 1;
      }
    }else{
      switch (win.width) {
        case 320:
          scale = 0.77;
          break;
        case 375:
          scale = 0.902;
          break;
        case 414:
          scale = 1;
          break;
        default:
          scale = 1;
      }
    }
    var s = this.props.style;
    if(s.width){
      if(s.width=="100%"){
        s.width = "100%";
      }else{
        s.width = s.width * scale;
      }
    }
    if(s.height){
      s.height = s.height * scale;
    }
    return (
      <ImageLoaderBase64 
        style={s} 
        // style={{ width:s.width, height:s.height, resizeMode:'cover', margin:3}}
        imageStyle={{ width:s.width, height:s.height}}
        loadingStyle={{ size: 'large', color: 'blue' }}
        placeholderSource={require('../images/empty-image.png')}
        source={this.props.source} 
        resizeMode={this.props.resizeMode || 'cover'} 
        />
    );
  }
}
 
export default Image;