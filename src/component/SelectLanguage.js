import React, { Component } from 'react';
import { 
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView
} from 'react-native';
import {
  Left,
  Body,
  Right
} from 'native-base'
import { connect } from 'react-redux'
import I18n from '../langs'
import { setLang } from '../actions/language'
const win = Dimensions.get("window")

export class SelectLanguage extends Component {
  constructor(props) {
    super(props);
    console.log(typeof(this.props.Lang.langIndex))
    this.state = {
      modalVisible:this.props.modalVisible,
      index:this.props.Lang.langIndex == undefined ? 0 : this.props.Lang.langIndex ,
      langType:''
    };
  }

  _showLanguageSelection(){
    this.setState({
      modalVisible:true
    })
  }

  _hideLanguageSelection(){
    this.setState({
      modalVisible:false
    })
  }

  _setLanguageIndex(index,langType){
     this.setState({
      index:index,
      langType:langType
     })
  }

  _setLang(){
    this.props.setLang({index:this.state.index,langType:this.state.langType})
    this._hideLanguageSelection()
  }

  render() {
    let that = this
    I18n.locale = this.props.Lang.lang;
    // console.log(I18n,I18n.currentLocale());
    return (
      <SafeAreaView style={{backgroundColor:global.styles.bodyLight}} >
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        style={styles.container}
        onRequestClose={() => this._hideLanguageSelection()}
      >
        <View style={styles.modalView}>
          <ImageBackground source={require('../images/LangSettings.png')} resizeMode='cover' style={{width:'100%'}}>
            <View style={{ flexDirection:"row", justifyContent:'center', alignItems:'center',  }}>
              <Left style={{ paddingLeft:10}}>
                <TouchableOpacity 
                  style={[{position:'absolute'}, Platform.OS == 'ios'?{left:9, top:-25}:{left:19, top:-25}]}
                  onPress={ ()=> this._hideLanguageSelection()}>
                  {/* <Text style={{ color:'#7f96d6', fontSize:16, fontWeight:'600'}}>{I18n.t("Close")}</Text> */}
                  <Image source={require('../images/btn_cancel.png')} style={{width:45*1.08, height:39*1.08}} />
                </TouchableOpacity>
              </Left>
              <View style={{ padding:10, justifyContent:'center', alignItems:'center'}}>
                <Image source={require('../images/icon_language_active.png')} style={{width:40*global.scale, height:40*global.scale}} />
                <Text style={{ color:'#7f96d6', fontSize:16, fontWeight:'600'}}>{I18n.t("ChangeLang")}</Text>
              </View>
              <Right style={{ paddingRight:10,}}>
                <TouchableOpacity 
                  style={[{position:'absolute'},  Platform.OS == 'ios'?{right:9, top:-25}:{right:19, top:-25}]}
                  onPress={() => this._setLang()}>
                  <Image source={require('../images/btn_save.png')} style={{width:45*1.08, height:39*1.08}} />
                  {/* <Text style={{ color:'#7f96d6', fontSize:16, fontWeight:'600'}}>{I18n.t("Save")}</Text> */}
                </TouchableOpacity>
              </Right>
            </View>
            <View style={{flex:1, marginTop:-23, marginLeft:20, marginRight:20}}>
              {
                Language.map(function(item,index){
                  return (
                    <TouchableOpacity key={index} onPress={ ()=> that._setLanguageIndex(item.id,item.langType) } style={{ padding:20,borderBottomWidth:1, borderBottomColor:'#00c5ff'}}>
                      <View style={{ flexDirection:"row", }}>
                        <Left><Text style={{ fontSize:16, color:that.state.index == item.id?global.colors.text.a1:global.colors.text.d1}}>{item.lang}</Text></Left>
                        <Right><View style={[styles.inactive,{backgroundColor:that.state.index == item.id?global.colors.text.a1:global.colors.text.d1}]} /></Right>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </ImageBackground>
        </View>
        
      </Modal>
      </SafeAreaView>
    );
  }
}

Language = [
  {
    id:0,
    lang:"English",
    langType:"en-US",
  },
  {
    id:1,
    lang:"中文（繁體）",
    langType:"zhHant",
  },
  {
    id:2,
    lang:"中文（簡体）",
    langType:"zhHans",
  },
]

const styles = StyleSheet.create({
  container :{
    flex: 1,
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(192,192,192,0.9)',
    elevation:10
  },
  modalView :{
    position:'absolute',
    flex:1,
    width:win.width,
    bottom:0,
    left:0,
    borderTopLeftRadius :0,
    borderTopRightRadius :0,
    // borderWidth:1,
    // borderColor:'#00c5ff',
    // backgroundColor:'rgba(255,255,255,1)'
  },
  inactive :{
    borderWidth:0,
    borderRadius:50,
    width:20,
    height:20,
  },
})

const mapStateToProps = ({ Lang }) => ({ Lang })
export default connect(mapStateToProps, { setLang, }, null, { forwardRef: true })(SelectLanguage)
