//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {Svg, Circle} from 'react-native-svg'
import I18n from '../../langs';

let AnimatedCircle = Animated.createAnimatedComponent(Circle)
// create a component
class DataChart extends Component {
  constructor(props)
  {
      super(props);
      this.state = {
        r:this.props.r||80,
        max:this.props.max||100,
        min:this.props.min||0,
        circleFillAnimation: new Animated.Value(50),
        value:(this.props.max - this.props.value)
      };
      this.dasharray = [Math.PI * 2 * this.state.r];
      // 这里是动画的映射关系
      this.circleAnimation = this.state.circleFillAnimation.interpolate({
          inputRange: [
              0,
              100,
          ],
          outputRange: [
              this.dasharray[0],
              0
          ]
        });
  }
  componentDidMount()
  {
      let val = this.state.value / this.props.max * 50;
      this.startAnimation(val, 50);

      setInterval(()=>{
        this.startAnimation(val, val - (val * 0.005) );
      }, 2000)
  }

  update(){
    let val = this.state.value / this.props.max * 50;
    this.startAnimation(val, 50);
  }
  
  startAnimation(val, max)
  {
      this.state.circleFillAnimation.setValue(max);
      Animated.spring(
          this.state.circleFillAnimation,
          {
              toValue: val,  // 设置进度值，范围：0～100
              friction: 5,     // 动画摩擦力
              tension: 35   // 动画张力
          }
      ).start();
  }
  
  render() {
    return (
      <View style={[{flexDirection:'row', alignItems:'flex-end', justifyContent:'center'}, this.props.style||'']}>
        
        <View style={{flex:1}}>
        </View>
        <View style={{marginRight:5}}>
          <Text style={[{fontSize:20, color:global.styles.dataChartTxt, marginRight: -12, marginBottom:-3, textAlign:'center'}, this.props.minTxtStyle||'']}>{this.state.min}</Text>
          <Text style={[{fontSize:20, color:global.styles.dataChartTxt, marginRight: -12, marginBottom:-3, textAlign:'center'}, this.props.minTxtStyle||'']}>GB</Text>
        </View>
        <Svg
          height={this.state.r + 16}
          width={(this.state.r + 20) * 2}
        >
          <Circle
              cx={(this.state.r + 20)}
              cy={this.state.r + 10}
              originX={(this.state.r + 20)}
              originY={this.state.r + 10}
              r={this.state.r}
              stroke={this.props.backgroundBarColor||"#FB96C4"}
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin='round'
              rotation="180"
              strokeDashoffset={Math.PI * this.state.r }
              strokeDasharray={Math.PI * this.state.r * 2 }
          />
          <AnimatedCircle
              cx={(this.state.r + 20)}
              cy={this.state.r + 10}
              originX={(this.state.r + 20)}
              originY={this.state.r + 10}
              r={this.state.r}
              stroke={this.props.barColor||"#FEF2DB"}
              strokeWidth={11.5}
              fill="none"
              rotation="180"
              strokeLinecap="round"
              strokeLinejoin='round'
              // strokeDashoffset={Math.PI * 2 * 80 - }
              // strokeDasharray={Math.PI * 2 * 80 }
              strokeDasharray={this.dasharray}
              strokeDashoffset={this.circleAnimation}
          />
          <View style={[{width:"100%", height:"100%", alignItems:'center', justifyContent:'flex-end'}, this.props.midRowStyle||'']}>
            <Text style={[{fontSize:20, color:global.styles.dataChartTxt, marginBottom:-3}, this.props.midTxtStyle||'']}>{I18n.t('Remaining Data')}</Text>
            <Text style={[{fontSize:20, color:global.styles.dataChartTxt, marginBottom:-3}, this.props.midTxtStyle||'']}>{this.state.value}GB</Text>
          </View>
        </Svg>
        <View style={{marginLeft:5}}>
          <Text style={[{fontSize:20, color:global.styles.dataChartTxt, marginLeft: -12, marginBottom:-3, textAlign:'center'}, this.props.maxTxtStyle||'']}>{this.state.max}</Text>
          <Text style={[{fontSize:20, color:global.styles.dataChartTxt, marginLeft: -12, marginBottom:-3, textAlign:'center'}, this.props.maxTxtStyle||'']}>GB</Text>
        </View>
        <View style={{flex:1}}>
        </View>
      </View>
      
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2DB',
  },
});

//make this component available to the app
export default DataChart;
