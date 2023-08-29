//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'

// create a component
class QuantitySet extends Component {
  constructor(props){
    super(props);

    var max;
    var affect = this.props.affect?this.props.affect.toString().split(','):1;
    if(typeof(affect)=='object' && affect.length == 1){
      affect = affect[0];
      max = this.props.max||99999;
    }else{
      max = affect[affect.length-1];
    }

    this.state={
      quantity:this.props.value||parseFloat(Math.max(this.props.min,0)),
      index:0,
      affect:affect,
      max:this.props.max||99999
    }
  }

  componentWillReceiveProps(props){
    this.state.quantity = props.value;
  }

  Plus(){
    if(!this.props.lock){
      if(parseFloat(this.state.quantity) < parseFloat(this.state.max)){
        let q;
        if(typeof(this.state.affect)=='object'){
          this.state.index++;
          q = parseFloat(this.state.affect[this.state.index]).toFixed(this.state.affect[this.state.index]<1?1:0);
        }else{
          q = (parseFloat(this.state.quantity)+parseFloat(this.state.affect)).toFixed(this.state.affect<1?1:0);
        }
        this.setState({
          quantity:q
        })
        this.props.update(q);
      }
    }
  }

  Minus(){
    if(!this.props.lock){
      if(parseFloat(this.state.quantity) > parseFloat(this.props.min||0)){
        let q;
        if(typeof(this.state.affect)=='object'){
          this.state.index--;
          q = parseFloat(this.state.affect[this.state.index]).toFixed(this.state.affect[this.state.index]<1?1:0);
        }else{
          q = (parseFloat(this.state.quantity)-parseFloat(this.state.affect)).toFixed(this.state.affect<1?1:0);
        }
        this.setState({
          quantity:q
        })

        this.props.update(q);
      }
    }
  }


  render() {
    return (
      <View style={[styles.container,this.props.containerStyle]}>
        <Text style={[{fontSize:20,color:'#999'}, this.props.textStyle]}>{this.props.name}</Text>
        {this.props.fix!="true" && this.state.quantity>parseFloat(this.props.min||0)?
        <TouchableOpacity
            onPress={()=>this.Minus()}
          >
          <Icon type="EvilIcons" name="minus" style={[styles.controller, {fontSize: 30* global.scale,}, this.props.controllerStyle]} />
        </TouchableOpacity>:null}
        <Text style={[styles.txt, {fontSize: 22* global.scale,}, this.props.textStyle]}>{this.state.quantity}</Text>
        {this.props.children}
        {this.props.fix!="true" && this.state.quantity<parseFloat(this.state.max)?
          <TouchableOpacity
            onPress={()=>this.Plus()}
          >
          <Icon type="EvilIcons" name="plus" style={[styles.controller, {fontSize: 30* global.scale,}, this.props.controllerStyle]} />
        </TouchableOpacity>:<View/>}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt:{
    margin:5,
    fontWeight: '400',
    color: "#2c2c2c",
    minWidth: 20,
    textAlign: 'center'
  },
  controller:{
    color: '#DE1C6D'
  }
});

//make this component available to the app
export default QuantitySet;
