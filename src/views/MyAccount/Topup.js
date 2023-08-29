import React, { Component } from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  NativeModules,
  StatusBar,
  StyleSheet,
  Dimensions
} from 'react-native';
import {
  Container,
  Content,
  Icon
} from 'native-base'
import MyHeader from '../../component/MyHeader'
import TopUp from '../../component/TopUp'
import I18n from '../../langs';
import { Actions } from 'react-native-router-flux';
import Statusbar from '../../component/Statusbar'
const win = Dimensions.get("window")

// create a component
class Topup extends Component {

  _TopUp(Price){
    this.refs.TopUp._showTopUp(Price)
  }

  render() {
    let that = this
    return (
      <Container>
        <Statusbar backgroundColor={global.colors.background.statusBar} />
        <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader 
            title={I18n.t('Topup')}
            titleColor={global.styles.headerTxt}
          />
        </View>
        <TopUp ref="TopUp" TopUp={false} title={TopUp}/>
      <Content>
      <View style={{ borderWidth:1, borderRadius:10, margin:10, marginLeft:20, marginRight:20, height:200, padding:10, borderColor:global.styles.textLight2, justifyContent:'center', alignItems:'center'}}>
        <View style={{justifyContent: 'center', alignItems:'center', }}>
          <Text style={{fontSize:24, color:global.styles.textLight1}}>{I18n.t('Your Balance')}</Text>
          <Text style={{ fontSize:50, color:global.styles.priceTxt}}>{global.NumberFormat(12345)}</Text>
          <View style={{position:'absolute', bottom:10, left:-42}}>
            <Icon type='Octicons' name="ruby" style={{fontSize: 36, color: global.styles.ruby, marginLeft:2, marginTop:5, marginRight:3}}/>
          </View>
        </View>
      </View>
      {/* <View style={{ justifyContent:'center', alignItems:'center'}}>
        <Image source={ require('../../images/topup_promote.jpg') } style={{ width:win.width - 40, height:150, resizeMode:'contain' }} />
      </View> */}
      <View style={{ justifyContent:'center', alignItems:'center', marginTop:10}}>
        <Text style={{ fontSize:24, fontWeight:"600", color: global.styles.textLight2}}>Top-Up</Text>
      </View>
      <View style={{ marginLeft:0, marginRight:0, flexDirection:'row', justifyContent: 'center', alignItems:'center', flexWrap:"wrap",  }}>
        {
          Price.map(function(item,i){
            return (
              <TouchableOpacity key={i} style={{ flexDirection:'row', borderWidth:1, borderRadius:10, padding:10, margin:10, width:125, height:65, borderColor:'lightblue', justifyContent:'center', alignItems:'center'}} onPress={() => that._TopUp(item.Price)}>
                <Icon type='FontAwesome' name="money" style={{fontSize: 26, color: global.styles.ruby, marginRight:5,}}/>
                <Text style={{ color:global.styles.textLight2, fontSize:22 }}>{item.Price}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
      <View style={{marginTop:30, backgroundColor:"#00000000"}} transparent />
      </Content>    
    </Container>
    );
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
export default Topup;

Price = [
  {
    id:0,
    Price:50,
    point:25
  },
  {
    id:1,
    Price:100,
    point:25
  },
  {
    id:2,
    Price:200,
    point:25
  },
  {
    id:3,
    Price:300,
    point:25
  },
  {
    id:4,
    Price:500,
    point:25
  },
  {
    id:5,
    Price:1000,
    point:25
  },
]