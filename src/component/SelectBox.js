import React, { Component } from 'react'
import { 
  Text, 
  View,
  TouchableOpacity
} from 'react-native'
import { Icon } from 'native-base';

import I18n from '../langs'
import ColorView from './ColorView';

export class SelectBox extends Component {
  constructor(props){
    super(props);
    this.state={
      selectedId:props.default?props.default:-1,
    }
    this.isColor = this.props.code.toLowerCase().indexOf("color") > -1;
  }

  onClick(option, i){
    i = option.value_index;
    if(this.state.selectedId==option.value_index){
      i = -1;
    }

    if(this.props.onChange){
      this.props.onChange({option_id:this.props.id, code:this.props.code, ...option, index:i});
    }

    this.setState({
      selectedId:i
    })
  }

  render() {
    return(
      <View
        style={{flex:1, maxWidth:'98%', flexDirection:this.isColor?'row':'column', flexWrap:'wrap', marginTop:5, alignItems:'center', justifyContent:'center',}}
        >
        {this.renderItem()}
        {
          this.props.requiredMissList.indexOf(""+this.props.id) > -1
          ?
            <Text
              style={{color:'red', fontSize:16, fontWeight:'bold'}}>
              {I18n.t("This is a required field")}
            </Text>
          :
            <View/>
        }
      </View>
    )
  }

  renderItem(){
    return this.props.options.map((option, i) => {
      let allowed = true;
      // // if(Object.keys(this.props.allowedList).length>0)
      // if(this.state.selectedId > -1 || Object.keys(this.props.allowedList).length>0)
      //   allowed =  Object.keys(this.props.allowedList).indexOf(""+option.value_index) > -1;
      // if(this.props.allowedList.indexOf("all") > -1){
      //   allowed = true;
      // }else 
      if(this.state.selectedId > -1 || this.props.allowedList.length>0){
        allowed = this.props.allowedList.indexOf(""+option.value_index) > -1;
      }
      return(
        <TouchableOpacity 
          key={i} 
          style={{
            padding:5, 
            marginRight:this.isColor?10:0, 
            marginTop:5, 
            borderRadius:10, 
            borderWidth:option.value_index==this.state.selectedId?2:0.6, 
            borderColor:option.value_index==this.state.selectedId?'#d6b203':'#cbc',
            opacity:allowed?1:0.3
            }}
          disabled={!allowed}
          activeOpacity={allowed?0.7:1}
          onPress={()=> allowed?this.onClick(option, i):console.log("not allowed")}
          >
          {
              !this.isColor ?
                  <View 
                    style={{width:'100%',flexDirection:'row', padding:2}}
                    >
                    <Text 
                      style={{
                        flex:1, 
                        fontSize:17,
                        color:global.styles.text1
                        }}
                      >
                      {option.label} 
                    </Text>
                  <View
                    style={{
                      alignItems:'center', 
                      justifyContent:'center',
                      marginLeft:4, 
                      marginRight:4
                    }}
                  >
                  {
                    option.value_index==this.state.selectedId?
                    <Icon type='Feather' name="check-circle" style={{fontSize: 26 * global.scale, color: '#d6b203', }}/>
                    :
                    <Icon type='Feather' name="circle" style={{fontSize: 26 * global.scale, color: '#cbc'}}/>
                  }
                  </View>
              </View>
              :
              <ColorView style={{width:50, height:50}} colorId={option.value_index} />
            }
        </TouchableOpacity>
      );
    });
  }
}

export default SelectBox
