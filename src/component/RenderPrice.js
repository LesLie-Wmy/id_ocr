//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

var moment = require('moment');

// create a component
class RenderPrice extends Component {
  render() {
    return (
      this._renderPrice(this.props.price, this.props.sprice, this.props.from, this.props.to)
    );
  }

  _renderPrice(price, sprice, from, to){
    let sprice_on = true;

    if(from && moment.parseZone(from.replace(" ","T") + "+08:00").utc().valueOf() > this.props.dateNow){
      sprice_on = false;
    }

    if(to && moment.parseZone(to.replace(" ","T") + "+08:00").utc().valueOf() < this.props.dateNow){
      sprice_on = false;
    }
    
    if(sprice > 0 && sprice_on){
      return (
        <View style={[{ alignItems:'center', justifyContent:'center'}, this.props.style]}>
            {
              price >0 ?
              <Text style={[{ textDecorationLine:'line-through',color:this.props.uColor?this.props.uColor:'#ccc', fontSize:this.props.uFontSize?this.props.uFontSize:12 * (global.scale==0.77?0.85:global.scale), alignSelf:'center', justifyContent:'center' }, this.props.oldPriceTxt]}>${ global.NumberFormat(parseFloat(price).toFixed(2)) }</Text>
              :
              null
            }
            <Text style={[{marginTop:price >0 ?-4:0, fontSize:(this.props.fontSize?this.props.fontSize:14) * (global.scale==0.77?0.85:global.scale), color:this.props.color?this.props.color:global.colors.text.a1}, this.props.fontStyle]}>${ global.NumberFormat(parseFloat(sprice).toFixed(2)) }</Text>

        </View>
      )
    }else if(price >0){
      return (
        <View style={[{ flexDirection:'row', alignItems:'center', justifyContent:'center'},this.props.style]}>
          {/* <Icon type='FontAwesome' name="money" style={{fontSize: 22, color: global.styles.ruby, marginRight:3, width:25}}/> */}
          <Text style={[{fontSize:(this.props.fontSize?this.props.fontSize:16) * (global.scale==0.77?0.85:global.scale), color:this.props.color?this.props.color:global.colors.text.a1}, this.props.fontStyle]}>$</Text>
          <Text style={[{fontSize:(this.props.fontSize?this.props.fontSize:16) * (global.scale==0.77?0.85:global.scale), color:this.props.color?this.props.color:global.colors.text.a1}, this.props.fontStyle]}>{ global.NumberFormat(parseFloat(price).toFixed(2)) }</Text>
        </View>
      )
    }else{
      return null
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default RenderPrice;
