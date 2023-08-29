import React, { Component } from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  NativeModules
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
} from 'native-base'

import { connect } from 'react-redux';
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import TopUp from '../../component/TopUp'
import ImagePicker from 'react-native-image-picker';
import DataChart from './DataChart';
import I18n from '../../langs';
import { Actions } from 'react-native-router-flux';
import { onSelectMySim, onSelectRelatedSim } from '../../actions/relatedSim'

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
  },
};

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource:''
    };

    this.menuList = [
      // {name:'SignIn', iconType:'SimpleLineIcons', icon:'pencil', onPress:() => Actions.RewardSignIn() },
      // {name:'Topup', iconType:'Octicons', icon:'ruby', onPress:() => Actions.Topup() },
      {name:'RelatedSim', iconType:'Octicons', icon:'link', onPress:() => Actions.RelatedSim() },
      {name:'WishList', iconType:'Octicons', icon:'tasklist', onPress:() => Actions.WishList() },
      {name:'Invite', iconType:'SimpleLineIcons', icon:'present', onPress:() => Actions.Invite({code:this.props.user.user.ref_no}) },
      {name:'AddressBook', iconType:'SimpleLineIcons', icon:'map', onPress:() => Actions.AddressBook() },
      {name:'OrderHistory', iconType:'SimpleLineIcons', icon:'list', onPress:() => Actions.OrderHistory() },
    ]
  }

  onEnterView(){
    this.refs.dateChart.update();
  }

  componentWillReceiveProps(props){
    console.log(props);
  }

  _TopUp(Price){
    this.refs.TopUp._showTopUp(Price)
  }

  _ImagePicker() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);      
      } else {
        const source = { uri: response.uri };

        this.setState({
          avatarSource: source,
        });
      }
    });  
  }


  render() {
    let that = this;
    I18n.locale = this.props.Lang.lang;
    if(this.props.user.user.email && this.props.user.user.token){
      return (
        <Container style={{ backgroundColor:global.styles.body}}>
          <Statusbar
            animated
            backgroundColor={global.colors.background.statusBar}
            barStyle="dark-content"
            translucent
            showHideTransition={'fade'}
          />
          <TopUp ref="TopUp" TopUp={false} title={TopUp}/>
        <Content>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop:20, marginRight:40  * global.scale}}>
          <TouchableOpacity style={{flex:1, alignItems:'flex-end', borderWidth:0, borderRadius:50, width:90, height:90, justifyContent:'center', alignItems:'center', overflow:'hidden'}} onPress={ () => this._ImagePicker()}>
            {
              this.state.avatarSource ? 
              <Image source={this.state.avatarSource}  style={{ width:200 * global.scale, height:200 * global.scale, marginTop:20 * global.scale}} />
              :            
              <Image source={require("../../images/menuicon_info.png")}  style={{ width:200, height:200, marginTop:20}} />
            }
          </TouchableOpacity>
          <View style={{flex:1, marginLeft:30, alignItems:'flex-start'}}>
            <Text style={{fontSize:20, textDecorationLine:'none', color:global.styles.textDark1, fontWeight:'600'}}>{I18n.t('Name')} : {this.props.user.user.firstname} {this.props.user.user.lastname}</Text>
            {
              this.props.user.user.telephone != ""
              ?
              <Text style={{fontSize:20, color:global.styles.textDark1, fontWeight:'600', marginTop:5}}>{I18n.t('Phone')} : {this.props.user.user.telephone}</Text>
              :
              null
            }
            {
              this.props.user.user.points != ""
              ?
              <View style={{flexDirection:'row'}}> 
                <Text style={{fontSize:20, color:global.styles.textDark1, fontWeight:'600', marginTop:5}}>{I18n.t('Balance')} : </Text>
                <Icon type='Octicons' name="ruby" style={{fontSize: 22, color: global.styles.ruby, marginLeft:2, marginTop:8, marginRight:3}}/>
                <Text style={{fontSize:20, color:global.styles.textDark1, fontWeight:'600', marginTop:5}}>{global.NumberFormat( parseInt(this.props.user.user.points) )}</Text>
              </View>
              :
              null
            }
            
          </View>
        </View>
        <View style={{marginTop:20, marginBottom:20}}>
          {
            this.props.user.user.telephone.length > 0?
              <DataChart ref='dateChart' r={100} style={{marginTop:10}} max={400} value={40} backgroundBarColor={global.styles.dataChartBGC} barColor={global.styles.dataChartColor} />
            : 
            <TouchableOpacity 
              style={{flex:1, paddingTop:10, paddingBottom:10, marginBottom:-20, alignItems:'center', justifyContent:'center', backgroundColor:global.styles.card}}
              onPress={()=>{Actions.ScanSim({no_skip:true})}}
              >
              <Text style={{fontSize:22, color:global.styles.text, fontWeight:'600'}}>{I18n.t('No eFun Sim Added')}</Text>
              <Text style={{fontSize:20, color:global.styles.btn, fontWeight:'600'}}>{I18n.t('Press to add eFun Sim')}</Text>
            </TouchableOpacity>
          }
          {
            this.props.user.user.telephone.length > 0?
            <TouchableOpacity 
              style={{position:'absolute', top:'2%', right:'7%'}}
              onPress={()=>{this.props.onSelectMySim(); Actions.Sim()}}
              >
                <Icon type='EvilIcons' name="plus" style={{fontSize: 46, color: global.styles.ruby, marginLeft:0, marginTop:5}}/>
            </TouchableOpacity>
            : null
          }
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:10}}>
        {
          this.menuList.map(function(item,i){
            if((item.name=='RelatedSim' && that.props.user.user.telephone.length > 0) || item.name!='RelatedSim'){
              return (
                <Card style={{width:'94%',flex:1,alignSelf:'center'}} >
                  <TouchableOpacity  onPress={item.onPress}>
                    <CardItem style={{flex:1,width:'100%'}}>
                      <Icon type={item.iconType} name={item.icon} style={{fontSize: 34* global.scale, color: '#e7a7a7', marginLeft:0, marginTop:5}}/>
                      <Text style={{fontSize:20* global.scale, color:global.styles.text, fontWeight:'400', marginLeft:10}}>{I18n.t(item.name)}</Text>
                      <View style={{flex:1}}>
                        <Icon type='EvilIcons' name="chevron-right" style={{fontSize: 50* global.scale, color: '#c7c7c7', alignSelf:'flex-end', textAlign:'right' }}/>
                      </View>
                    </CardItem>
                  </TouchableOpacity>
                </Card>
              )
            }else{
              return (<View/>)
            }
           })
        }
        </View>
        <View style={{marginTop:30, backgroundColor:"#00000000"}} transparent />
        </Content>    
      </Container>
      );
    }else{
      return(
        <Container style={{ backgroundColor:global.styles.body}}>
          <Statusbar
            animated
            backgroundColor={global.colors.background.statusBar}
            barStyle="dark-content"
            translucent
            showHideTransition={'fade'}
          />
          <TopUp ref="TopUp" TopUp={false} title={TopUp}/>
          <View style={{ backgroundColor:global.colors.background.statusBar}}>
            <MyHeader 
              // title={"MyAccount"} 
              titleColor={global.styles.headerTxt} 
              renderLeft={<View/>}
              />
          </View>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>Actions.Login({back:true})}>
              <Text style={{color:global.styles.textLight2, fontSize:20}}>{I18n.t("Press Here to Login")}</Text>
            </TouchableOpacity>
          </View>
        </Container>
      );
    }
    
  }
}

const mapStateToProps = ({ simHome, Lang, user }) => ({ simHome, Lang, user });
export default connect(mapStateToProps, { onSelectMySim, onSelectRelatedSim }, null, { forwardRef: true })(MyAccount);

