//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'



// create a component
class OptionsSet extends Component {
  constructor(props){
    super(props);

    var max, min;
    var affect
    let optionValue = {};
    if(props.data && props.data.product_option_value){
      props.data.product_option_value.forEach(value => {
        if(value.key=="Affect"){
          affect = value.value?value.value.toString().split(','):1;
          if(typeof(affect)=='object' && affect.length == 1){
            affect = affect[0];
          }else{
            max = affect[affect.length-1];
          }
          optionValue[value.key]={name:value.name, value:affect, id:value.product_option_value_id}
        }else{
          optionValue[value.key]={name:value.name, value:value.value, id:value.product_option_value_id}
        }
      });
    }
    if( this.props.max ){
      max = this.props.max;
    }else{
      max = optionValue.Max?optionValue.Max.value:9;
    }
    
    min = optionValue.Min?optionValue.Min.value:1;
    this.state={
      quantity:parseFloat(Math.max(min,1)),
      min:parseFloat(Math.max(min,1)),
      index:0,
      max:max,
      optionValue:optionValue
    }
    this.oldValue;
  }

  Plus(){
    // if(!this.props.lock){
      if(parseFloat(this.state.quantity) < parseFloat(this.state.max)){
        let q;
        if(this.state.optionValue.Affect && typeof(this.state.optionValue.Affect.value)=='object'){
          this.state.index++;
          q = parseFloat(this.state.optionValue.Affect.value[this.state.index]).toFixed(this.state.optionValue.Affect.value[this.state.index]<1?1:0);
        }else{
          let v = 1;
          if(this.state.optionValue.Affect && this.state.optionValue.Affect.value){
            v = this.state.optionValue.Affect.value;
          }
          q = (parseFloat(this.state.quantity)+parseFloat(v)).toFixed(v<1?1:0);
        }
        this.setState({
          quantity:q
        })
        // this.props.update(q, this.props.index, this.state.optionValue.Min.id, this.state.optionValue.Unit.name);
      }
    // }
  }

  Minus(){
    // if(!this.props.lock){
      if(parseFloat(this.state.quantity) > parseFloat(this.state.min||0)){
        let q;
        if(this.state.optionValue.Affect && typeof(this.state.optionValue.Affect.value)=='object'){
          this.state.index--;
          q = parseFloat(this.state.optionValue.Affect.value[this.state.index]).toFixed(this.state.optionValue.Affect.value[this.state.index]<1?1:0);
        }else{
          let v = 1;
          if(this.state.optionValue.Affect && this.state.optionValue.Affect.value){
            v = this.state.optionValue.Affect.value;
          }
          q = (parseFloat(this.state.quantity)-parseFloat(v)).toFixed(v<1?1:0);
        }
        this.setState({
          quantity:q
        })

        // this.props.update(q, this.props.index, this.state.optionValue.Min.id, this.state.optionValue.Unit.name);
      }
    // }
  }

  renderPlus(){
    let f = false;
    if(this.state.optionValue.Fixed && this.state.optionValue.Fixed.value){
      f = this.state.optionValue.Fixed.value.toLowerCase();
    }
    return(
      <View>
        {
          f!="true" && this.state.quantity<parseFloat(this.state.max)?
            <TouchableOpacity
              onPress={()=>this.Plus()}
            >
              { this.props.renderPlus?
                this.props.renderPlus:
                <Icon type="EvilIcons" name="plus" style={[styles.controller, {fontSize: 30* global.scale,}, this.props.controllerStyle]} />
              }
          </TouchableOpacity>
          :
          this.props.renderPlus?
          <View style={{ opacity:0 }}>{this.props.renderPlus}</View>:
          <Icon type="EvilIcons" name="plus" style={[styles.controller, {fontSize: 30* global.scale,opacity:0}, this.props.controllerStyle]} />
        }
      </View>
    )
  }

  renderMinus(){
    return(
      <View>
        {this.state.quantity>parseFloat(this.state.min)?
          <TouchableOpacity
              onPress={()=>this.Minus()}
            >
            {
              this.props.renderMinus?
              this.props.renderMinus:
              <Icon type="EvilIcons" name="minus" style={[styles.controller, {fontSize: 30* global.scale,}, this.props.controllerStyle]} />
            }
          </TouchableOpacity>
          :
          this.props.renderMinus?
          <View style={{ opacity:0 }}>{this.props.renderMinus}</View>:
          <Icon type="EvilIcons" name="minus" style={[styles.controller, {fontSize: 30* global.scale, opacity:0 }, this.props.controllerStyle]} />
          }
      </View>
    )
  }

  render() {
    if((this.state.optionValue.Type && this.state.optionValue.Type.value=='STEPPER') || this.props.type=='STEPPER'){
      
      this.props.update({
        val:parseFloat(this.state.quantity),
        index:this.props.index,
        update_total:(this.props.data.update_total && this.state.optionValue.Fixed.value.toLowerCase()!="true"),
        id:this.state.optionValue.Min.id,
        unit:this.state.optionValue.Unit.name,
        option_id:this.props.data.option_id,
        product_option_id:this.props.data.product_option_id,
      });
      return (
        <View style={[styles.container,this.props.containerStyle]}>
          <Text style={[{fontSize:20,color:'#999', flex:0.5}, this.props.textStyle, this.props.textLabelStyle]}>{this.props.data.name}</Text>
          <View style={{flex:0.5, flexDirection: 'row' }}>
            {this.renderMinus()}
            <Text style={[styles.txt, {fontSize: 22* global.scale,}, this.props.textStyle, this.props.textNumberStyle]}>{this.state.quantity}</Text>
            <Text style={[{fontSize:22* global.scale}, this.props.textStyle, this.props.textUnitStyle]}>{this.state.optionValue.Unit.name}</Text>
            {this.props.children}
            {this.renderPlus()}
          </View>
          
        </View>
      );
    }else if(this.props.type=='Quantity'){
      if(this.oldValue!=this.state.quantity){
        this.props.update(this.state.quantity);
        this.oldValue=this.state.quantity;
      }
      return (
        <View style={[styles.container,this.props.containerStyle]}>
          <Text style={[{fontSize:20,color:'#999'}, this.props.textStyle, this.props.textLabelStyle]}>{this.props.name||""}</Text>
          <View style={{ flexDirection: 'row'}}>
            <View
              style={{alignSelf:'flex-start'}}
            >
              {this.renderMinus()}
            </View>
          
            <Text style={[styles.txt, {fontSize: 22* global.scale,}, this.props.textStyle, this.props.textNumberStyle]}>{this.state.quantity}</Text>

            <Text style={[{fontSize:22* global.scale}, this.props.textStyle, this.props.textUnitStyle]}>{this.props.Unit}</Text>
            {this.props.children}
            <View
             style={{alignSelf:'flex-end'}}
             >
                {this.renderPlus()}
             </View>
            
          </View>
          
        </View>
      );
    }else{
     return( <View/> )
    }
    
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  txt:{
    marginLeft:10,
    marginRight:10,
    fontWeight: '400',
    color: "#2c2c2c",
    // minWidth: 20,
  },
  controller:{
    color: '#DE1C6D',
    marginTop:4
  }
});

//make this component available to the app
export default OptionsSet;
