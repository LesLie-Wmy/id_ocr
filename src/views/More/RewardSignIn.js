import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Content,
  Icon,
} from 'native-base'
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import I18n from '../../langs'
const win = Dimensions.get("window");


export default class RewardSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (
      <Container>
        <Statusbar backgroundColor={global.colors.background.statusBar} />
        <View style={{ backgroundColor:global.colors.background.statusBar }}>
          <MyHeader 
            title={I18n.t('SignIn')}
            titleColor={global.styles.headerTxt}
          />
        </View>
        <Content>
          <View style={{ backgroundColor:'#81d681', justifyContent:'center', alignItems:'center', padding:10 }}>
            <View>
              <Text style={{ color:'white', fontSize:20 }}>每日簽到</Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', borderWidth:0,width:win.width}}>
              <View style={{ borderWidth:10, borderColor:'#73be73', borderRadius:100, width:120, height:120, justifyContent:'center', alignItems:'center'}}>
                <Text style={{ color:'white', fontSize:16 }}>我的積分</Text>
                <View style={{ flexDirection:'row'}}>
                <Icon type='Octicons' name="ruby" style={{fontSize: 26, color: global.styles.ruby, marginLeft:2, marginTop:5, marginRight:3}}/>
                <Text style={{ color:'white', fontSize:20 }}>150</Text>
                </View>
              </View>
              <TouchableOpacity style={{ borderWidth:10, borderColor:'#73be73', borderRadius:100, width:120, height:120, justifyContent:'center', alignItems:'center' }}>
                <Icon type="SimpleLineIcons" name="pencil" style={{fontSize: 22, color: 'white', marginLeft:0, marginTop:5}}/>
                <Text style={{ color:'white', fontSize:20 }}>簽到</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap:'wrap', width:win.width , justifyContent:'space-between', alignItems:'flex-start'}}>
            {
              lottery.map(function(item,index){
                if(index == 0 || index == 1 || index == 2 ){
                  return (
                    <View style={{ borderWidth:1, borderColor:global.styles.dataChartBGC, width:78, height:78, margin:5,}}>
                      <ImageBackground source={ require('../../images/giftOverlay.png') } style={{ width:70, height:70, zIndex:999 }}>  
                        <View style={{ flexDirection:'row', borderWidth:0, padding:5, opacity:.3 }}>
                          <Text style={{ color:'grey', fontSize:18, paddingRight:2 }}>{item.day}</Text>
                          <Text style={{ color:'grey', fontSize:18}}>{I18n.t("Day")}</Text>
                        </View>
                        <View style={{ flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center',borderWidth:0, opacity:.3}}>
                          <Icon type='Octicons' name="ruby" style={{fontSize: 26, color: 'lightgrey', marginLeft:2, marginTop:5, marginRight:3}}/>
                          <Text style={{ color:'grey', fontSize:18}}>{item.prize}</Text>
                        </View>
                        </ImageBackground>
                    </View>
                  );
                }else{
                  return (
                    <View style={{ borderWidth:1, borderColor:global.styles.dataChartBGC, width:78, height:78, margin:5 }}>
                      <View style={{ flexDirection:'row', borderWidth:0, padding:5, }}>
                        <Text style={{ color:'black', fontSize:18, paddingRight:2 }}>{item.day}</Text>
                        <Text style={{ color:'black', fontSize:18}}>{I18n.t("Day")}</Text>
                      </View>
                      <View style={{ flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center',borderWidth:0,}}>
                        <Icon type='Octicons' name="ruby" style={{fontSize: 26, color: global.styles.ruby, marginLeft:2, marginTop:5, marginRight:3}}/>
                        <Text>{item.prize}</Text>
                      </View>
                    </View>
                  );
                }
              })
            }
        </View>
        </Content>
      </Container>
    );
  }
}

const lottery = [
  { id:0, day:0, prize:2, type:'points',},
  { id:1, day:1, prize:4, type:'points'},
  { id:2, day:2, prize:6, type:'points',},
  { id:3, day:3, prize:8, type:'points',},
  { id:4, day:4, prize:10, type:'points',},
  { id:5, day:5, prize:12, type:'points',},
  { id:6, day:6, prize:14, type:'points',},
  { id:7, day:7, prize:16, type:'points',},
  { id:8, day:8, prize:18, type:'points',},
  { id:9, day:9, prize:20, type:'points',},
  { id:10, day:10, prize:22, type:'points',},
  { id:11, day:11, prize:24, type:'points',},
  { id:12, day:12, prize:26, type:'points',},
  { id:13, day:13, prize:28, type:'points',},
  { id:14, day:14, prize:30, type:'points',},
  { id:15, day:15, prize:50, type:'points',},
]