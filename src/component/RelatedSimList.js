import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Platform,
  TouchableOpacity,
  SafeAreaView
 } from 'react-native';
 import { 
   Container, 
   Content, 
   Spinner,
   Card,
   CardItem,
   Icon
 } from 'native-base'
import { connect } from 'react-redux';
import { onSelectMySim, onSelectRelatedSim } from '../actions/relatedSim'
import { fetchingData } from '../actions/fetch';

import I18n from '../langs'
import Loading from './loading'
import MyHeader from './MyHeader'
import Statusbar from './Statusbar'
import { Actions } from 'react-native-router-flux';
import { setTimeout } from 'core-js';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffffeA',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:Platform.OS=='android'?20:0,
  }
});
 
class RelatedSimList extends Component {

  componentDidMount(){
    if(this.props.relatedSim.simList.length==0){
      this.props.fetchingData({
        start:'FETCH_RELATED_SIM_DATA_START',
        next:'FETCH_RELATED_SIM_SUCCESS', 
        rejected:'FETCH_RELATED_SIM_ERROR', 
        method:'POST',
        url:'relatedSim.php', 
        data:{
          "email":this.props.user.user.email,
          "password":this.props.user.user.password,
          "action":'query'
        }
      });
    }
  }

  render() { 
    if(this.props.relatedSim.isLoading){
      return (
          <Container style={styles.container}>
            <SafeAreaView style={{flex:1, marginLeft:10, width:'100%'}}>
              <View style={{flexDirection:'row', padding:5, marginTop:21, marginBottom:0, borderBottomColor:'#ccccccea', borderBottomWidth:1, alignItems:'flex-start', justifyContent:'flex-start'}}>
                <TouchableOpacity onPress={()=>Actions.pop()}>
                  <Text style={{color:'#2F004F', fontSize:18}}>{I18n.t('BACK')}</Text>
                </TouchableOpacity>
                <View style={{flex:1, alignItems:'center' }} >
                  <Text style={{color:'#2F004F', fontSize:20}}></Text>
                </View>
                <Text style={{color:'#ffffffeA', opacity:0, fontSize:22}}>{I18n.t('BACK')}</Text>
              </View>
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Spinner size={Platform.OS=="ios"?"large":60} color={'#ddd'} />
              </View>
            </SafeAreaView>
          </Container>
      );
    }else{
      let data = [{id:this.props.user.user.customer_id, nickname:I18n.t('Me'), phone:this.props.user.user.telephone, status:1}];
      data = data.concat(this.props.relatedSim.simList);
      return (
        <Container style={styles.container}>
          <SafeAreaView style={{flex:1}}>
            <View style={{flexDirection:'row', padding:5, marginTop:0, marginBottom:0, borderBottomColor:'#ccccccea', borderBottomWidth:1, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>Actions.pop()}>
                  <Text style={{color:'#2F004F', fontSize:18}}>{I18n.t('BACK')}</Text>
                </TouchableOpacity>
                <View style={{flex:1, alignItems:'center' }} >
                  <Text style={{color:'#2F004F', fontSize:20}}>{I18n.t('To Select Sim')}</Text>
                </View>
                <Text style={{color:'#ffffffeA', opacity:0, fontSize:22}}>{I18n.t('BACK')}</Text>
              </View>
              <Content>
                <FlatList
                  data={data}
                  // numColumns={1}
                  // style={{flex:1, }}
                  contentContainerStyle={{paddingBottom:20}}
                  renderItem={({item, index}) => this.render_items({item, index})}
                />
              </Content>
          </SafeAreaView>
          
        </Container>
      );
    }
  }

  render_items({item, index}){
    if(item.status==1){
      return(
        <TouchableOpacity onPress={()=>{this.props.onSelectRelatedSim(index); setTimeout(()=>{Actions.pop()},600) }} style={{flex:1, width:'100%'}}>
          <Card>
            <CardItem style={{
                width:'96%'
                }}>
              <View style={{
                padding:10,
                width:'100%', 
                flexDirection:'row',
                }}>
                
                <Text style={{fontSize:22, color:'#3d4f9a', marginTop:5}}><Icon type='Feather' name='user' style={{fontSize:22, color:'#729c3b'}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{item.nickname}</Text></Text>
                <Text style={{fontSize:22, color:'#3d4f9a', marginTop:5, marginLeft:30}}><Icon type='AntDesign' name='mobile1' style={{fontSize:22, color:'#729c3b'}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{global.omitString(item.phone)}</Text></Text>
              </View>
              {
              this.props.relatedSim.onSelect == index?
              <View style={{
                flexDirection:'row', 
                flex:1, 
                justifyContent:'center', 
                alignItems:'center', 
                margin:10,
                width:'100%',
                }}>
                <Icon type='AntDesign' name='checkcircleo' style={{fontSize:26, color:'#729c3b',marginRight:20}} />
              </View>:null
              }
            </CardItem>
          </Card>
        </TouchableOpacity>
      )
    }else{return(<View/>)}
    
  }
}
 
const mapStateToProps = ({ relatedSim, user }) => ({ relatedSim, user });
export default connect(mapStateToProps ,{onSelectMySim, onSelectRelatedSim, fetchingData})(RelatedSimList);