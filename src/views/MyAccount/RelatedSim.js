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

import { onSelectRelatedSim } from '../../actions/relatedSim'
import { fetchingData } from '../../actions/fetch';
import I18n from '../../langs';
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import {LoadingWithoutModal as Loading} from '../../component/LoadingWithoutModal'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:global.colors.background.statusBar
  }
});
 
class RelatedSim extends Component {
  constructor(props){
    super(props);
    this.state={
    }

    this.statusName = [
      I18n.t('Unverified'),
      I18n.t('Verified'),
      I18n.t('Invalid'),
    ]
  }

  componentDidMount(){
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

  delete(index, phone){
    Alert.alert(
      I18n.t('Delete Related Sim'),
      I18n.t('Do yuo want to delete: ')+name+ ' ?',
      [
        {text: I18n.t('Cancel'), onPress: () =>  console.log("Press Cancel")},
        {text: I18n.t('YES'), onPress: () =>  this.deleteItemFetch(index, phone)},
      ],
      {cancelable: false}
    )
  }

  deleteItemFetch(index, phone){
    this.props.fetchingData({
      start:'SUBMIT_RELATED_SIM_START',
      next:'DELETE_RELATED_SIM_SUCCESS', 
      rejected:'FETCH_RELATED_SIM_ERROR', 
      method:'POST',
      url:'relatedSim.php', 
      data:{
        "index":index,
        "email":this.props.user.user.email,
        "password":this.props.user.user.password,
        "phone":phone,
        "action":'delete'
      }
    });
  }

  edit(index, id,  name, phone){
    Actions.AddRelatedSim({refresh:{ data: Math.random() * 10}, mode:'edit', 'nickname':name, phone, email:this.props.user.user.email, password:this.props.user.user.password, index:index})
  }

  verify(index, id, name, phone){
    Actions.RelatedSimConfirm({
      email:this.props.user.user.email,
      password:this.props.user.user.password,
      phone:phone,
      nickname:name,
      index:index
    });
  }

  gift(index, id){
    // Actions.pop();
    setTimeout(()=> {Actions.Sim({refresh: true})}, 200); Actions.pop();
    this.props.onSelectRelatedSim(index+1);
    // Actions.Sim({ refresh:{ data: Math.random() * 10}, data:{type:'gift'}, id:id});
  }

  render_items({item, index}){
    return(
      <View style={{width:'47%', marginLeft:'2%'}}>
        <Card style={{width:'100%'}}>
          <View style={{
              flexDirection:'column', 
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
              {/* <Text style={{fontSize:22, color:global.styles.textLight2, marginTop:5}}><Icon type='Feather' name='flag' style={{fontSize:22, color:global.styles.textLight3}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{item.id}</Text></Text> */}
              <Text style={{fontSize:22, color:global.styles.textLight2, marginTop:5}}><Icon type='Feather' name='user' style={{fontSize:22, color:global.styles.textLight3}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{item.nickname}</Text></Text>
              <Text style={{fontSize:22, color:global.styles.textLight2, marginTop:5}}><Icon type='AntDesign' name='mobile1' style={{fontSize:22, color:global.styles.textLight3}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{global.omitString(item.phone)}</Text></Text>
              <Text style={{fontSize:22, color:global.styles.textLight2, marginTop:5}}><Icon type='EvilIcons' name='star' style={{fontSize:22, color:global.styles.textLight3}} /> <Text style={{fontSize:18, color:'#3d1f2a',}}>{this.statusName[item.status]}</Text></Text>
            </View>
            <View style={{
              flexDirection:'row', 
              flex:1, 
              justifyContent:'space-between', 
              alignItems:'center', 
              marginTop:10,
              marginBottom:10,
              paddingLeft:'5%',
              paddingRight:'5%',
              }}>
              <TouchableOpacity style={{flex:1,alignSelf:'center',alignItems:'center'}} onPress={()=>this.delete(index, item.phone)}>
                <Icon type='Feather' name='trash-2' style={{fontSize:26, color:global.styles.icon}} />
              </TouchableOpacity>
              { 
                item.status<2?
                <TouchableOpacity style={{flex:1,alignSelf:'center',alignItems:'center',}} onPress={()=>this.edit(index, item.id, item.nickname, item.phone)}>
                  <Icon type='Feather' name='edit-3' style={{fontSize:26, color:global.styles.icon}} />
                </TouchableOpacity>
                :null
              }
              { 
                item.status==0?
                <TouchableOpacity style={{flex:1,alignSelf:'center',alignItems:'center',}} onPress={()=>this.verify(index, item.id, item.nickname, item.phone)}>
                  <Icon type='AntDesign' name='key' style={{fontSize:26, color:global.styles.icon}} />
                </TouchableOpacity>
                :null
              }
              { 
                item.status==1?
                <TouchableOpacity style={{flex:1,alignSelf:'center',alignItems:'center',}} onPress={()=>this.gift(index, item.id)}>
                  <Icon type='Feather' name='gift' style={{fontSize:26, color:global.styles.icon}} />
                </TouchableOpacity>
                :null
              }
            </View>
          </View>
        </Card>
      </View>
    )
  }
  
  render() { 
    if(this.props.relatedSim.isLoading){
      return(
        <Container style={styles.container}>
          <Statusbar backgroundColor={global.colors.background.statusBar} />
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              title={I18n.t('RelatedSim')}
              titleColor={global.styles.headerTxt}
            />
          </View>
          <Loading style={{backgroundColor:global.colors.background.statusBar, height:'100%' }} Color={global.styles.textLight3} textColor='#333' ref="Loading" isShow={true} text={I18n.t('Loading')} />
          
        </Container>
      )
    }else if(!this.props.relatedSim.isLoading && this.props.relatedSim.simList.length == 0){
      return(
        <Container style={styles.container}>
          <Statusbar backgroundColor={global.colors.background.statusBar} />
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
                title={I18n.t('RelatedSim')}
                titleColor={global.styles.headerTxt}
                renderRight={
                  <TouchableOpacity style={{width:35,height:35,marginRight:5}} 
                    onPress={()=>Actions.AddRelatedSim({mode:'new', email:this.props.user.user.email, password:this.props.user.user.password})}
                    >
                    <Icon type='Feather' name='plus' style={{fontSize:35, color:global.styles.headerTxt}} />
                  </TouchableOpacity>
                }
              />
          </View>
          <View style={{flex:1, alignItems:'center', marginTop:10}}>
            <Text>{I18n.t('-------------- Data Not Found --------------')}</Text>
          </View>
        </Container>
      )
    }else{
      return (
        <Container style={styles.container}>
          <Statusbar backgroundColor={global.colors.background.statusBar} />
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              title={I18n.t('RelatedSim')}
              titleColor={global.styles.headerTxt}
              renderRight={
                <TouchableOpacity style={{width:35,height:35,marginRight:5}} 
                  onPress={()=>Actions.AddRelatedSim({mode:'new', email:this.props.user.user.email, password:this.props.user.user.password})}
                  >
                  <Icon type='Feather' name='plus' style={{fontSize:35, color:global.styles.headerTxt}} />
                </TouchableOpacity>
              }
            />
          </View>
          <FlatList
            data={this.props.relatedSim.simList}
            numColumns={2}
            style={{flex:1, }}
            contentContainerStyle={{}}
            renderItem={({item, index}) => this.render_items({item, index})}
          />
        </Container>
      );
    }
  }
}

const mapStateToProps = ({ relatedSim, user }) => ({ relatedSim, user });
export default connect(mapStateToProps,{onSelectRelatedSim, fetchingData})(RelatedSim);