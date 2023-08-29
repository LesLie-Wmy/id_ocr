import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
} from 'native-base'
import { Actions, ActionConst } from 'react-native-router-flux';

import I18n from '../../langs';
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const data = [
  {id:1, name:'Sim 1', phone:'52133213', imei:'131234574732'},
  {id:2, name:'Sim 2', phone:'92133213', imei:'564234574432'},
  {id:3, name:'Sim 3', phone:'62133213', imei:'231234574432'},
  {id:4, name:'Sim 4', phone:'92133213', imei:'434345474232'},
  {id:5, name:'Sim 5', phone:'62123213', imei:'143675574332'},
  {id:6, name:'Sim 6', phone:'52133233', imei:'331234574732'},
  {id:7, name:'Sim 7', phone:'92113213', imei:'684344574532'},
]
 
class RelatedSimPop extends Component {
  constructor(props){
    super(props);
    this.state={
      rows:data
    }
  }

  delete(id, name){
    Alert.alert(
      I18n.t('Delete Related Sim'),
      I18n.t('Do yuo want to delete: ')+name+ ' ?',
      [
        {text: I18n.t('Cancel'), onPress: () =>  console.log("Press Cancel")},
        {text: I18n.t('OK'), onPress: () =>  console.log("Press OK")},
      ],
      {cancelable: false}
    )
  }

  edit(id, imei, name){
    Actions.AddRelatedSim({mode:'edit', nickname:name, phone, imei:imei, id:id})
  }

  gift(id){
    // Actions.pop();
    Actions.Sim({ data:{type:'gift'}, id:id});
  }

  render_items({item}){
    if(item.status==1)
    return(
      <View style={{width:'47%', marginLeft:'2%'}}>
        <TouchableOpacity 
          // onPress={()=>this.props.onPress(item.id)}
          >
          <Card style={{width:'100%'}}>
            <View style={{
                flexDirection:'row', 
                alignItems:'flex-start',
                borderBottomColor:'#ccc',
                borderBottomWidth:1
                }}>
              <View style={{
                padding:12,
                width:'100%', 
                borderBottomColor:'#ccc',
                borderBottomWidth:1
                }}>
                <Text style={{fontSize:22, color:'#3d4f9a', marginTop:5}}><Icon type='Feather' name='user' style={{fontSize:22, color:'#729c3b'}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{item.nickname}</Text></Text>
                <Text style={{fontSize:22, color:'#3d4f9a', marginTop:5}}><Icon type='Feather' name='phone' style={{fontSize:22, color:'#729c3b'}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{global.omitString(item.phone)}</Text></Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    )
    else
    return <View/>
  }
  render() { 
    return (
      <Container style={styles.container}>
        <Statusbar/>
        <View style={{ backgroundColor:'#fff'}}>
          <MyHeader 
            title={I18n.t('RelatedSimPop')}
            titleColor={global.styles.headerTxt}
            renderRight={
              <TouchableOpacity style={{width:35,height:35,marginRight:5}} onPress={()=>Actions.ScanSim({data:{type:'relateSim'}})}>
                <Icon type='Feather' name='plus' style={{fontSize:35, color:'white'}} />
              </TouchableOpacity>
            }
          />
        </View>
        <FlatList
          data={this.state.rows}
          style={{flex:1, }}
          contentContainerStyle={{}}
          renderItem={({item}) => this.render_items({item})}
        />
      </Container>
    );
  }
}
 
export default connect()(RelatedSimPop);