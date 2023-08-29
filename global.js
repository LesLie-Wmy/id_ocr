import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';

const win = Dimensions.get('window');
var scale;
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

global.scale = scale;


global.NumberFormat = (x) => {
  if(parseFloat(x) > -99999)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

global.omitString = (text, _rate, symbol, length) => {
  
  let omitString = '';
  if(text){
    let rate = _rate || 0.2;
    let len = Math.min(length||Infinity,text.length);
    for (let i = 0; i < len; i++) {
      if(i < len * rate || i > len * (1 - rate - 0.1)){
        omitString += text[i];
      }else{
        omitString += symbol||'*';
      }
    }
  }

  return omitString;
}