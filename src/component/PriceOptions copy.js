import React, { PureComponent } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Animated,
  FlatList
 } from 'react-native';
 import {
  Icon
 } from 'native-base'
import { connect } from 'react-redux';
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderColor: "#ccc",
    // borderWidth:2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  txtPrice:{
    fontSize: 18 * (global.scale==0.77?0.85:global.scale),
    color:global.styles.ruby,
    alignSelf:"center",
    justifyContent: "center",
    textAlign: "center"
  },
});
 
class PriceOptions extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      onpress:false,
      left:null,
      top:null,
      onSelected:false,
      onSelectedIndex:null,
      width:null
    }
  }

  measureRect(){
    if (
      typeof this.Wrapper.measureInWindow === 'function'
    ) {
      this.Wrapper.measureInWindow((x, y, width, height) => {
        console.log(x, y, width, height);
        this.setState({
          left:x,
          top:y+height,
          width:width
        })
      });
    }
  }

  setSelect(index, product_option_id, product_option_value, option_id){
    if(index == this.state.onSelectedIndex && this.showMore){
      this.setState({onpress:true});
    }else{
      this.setState({
        onSelected:true,
        onSelectedIndex:index,
        onpress:false
      })
      if(this.props.onSelect){
        this.props.onSelect(index, product_option_id, product_option_value, option_id);
      }
    }
  }

  renderPrice({item, index}, all){
    if((index<2 && !this.state.onSelected && !all) || 
       (index==this.state.onSelectedIndex && this.state.onSelected  && !all) ||
       (this.state.onSelected && index!=this.state.onSelectedIndex && all) ||
       (!this.state.onSelected && index>1 && all)
       ){
      // if(item.sprice){
        return(
          <TouchableOpacity
            onPress={()=>this.setSelect(index, item.product_option_id, item.product_option_value, item.option_id)}
            style={{flexDirection:'row',padding:5, justifyContent:'center', alignItems:'center', flex:1, margin:2, borderWidth:1, borderColor:global.styles.ruby, height:50}}>
            
              <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
              {parseInt(item.spoints)>=1 || parseInt(item.points)>0? <Icon type='Octicons' name="ruby" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3 }}/>:null}
                {parseInt(item.spoints)>=1?
                  <View>
                    <Text 
                      style={{
                        textDecorationLine:'line-through', 
                        color:'#ccc',
                        fontSize:12 * (global.scale==0.77?0.85:global.scale), 
                        alignSelf:'center', 
                        justifyContent:'center'}} 
                      numberOfLines={1}>
                      {global.NumberFormat(parseInt(item.points))}
                    </Text>
                    <Text style={[styles.txtPrice,{marginTop:-4}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.spoints))} </Text>
                  </View>:
                  parseInt(item.points)>0?
                  <View>
                  <Text style={[styles.txtPrice,{marginTop:-4}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.points))} </Text>
                  </View>:null
                }
              </View>
            {parseInt(item.price)>=1 && parseInt(item.points)>=1?
              <View>
                <Icon type='AntDesign' name='plus' style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3, marginLeft:2, marginRight:4  }}/>
              </View>:null
            }
            
              <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center', marginLeft:2}}>
              {parseInt(item.sprice)>0 || parseInt(item.price)>0 ? <Icon type='FontAwesome' name="money" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3 }}/>:null}
                  {parseInt(item.sprice)>0?
                    <View>
                      <Text 
                      style={{
                        textDecorationLine:'line-through', 
                        color:'#ccc',
                        fontSize:12 * (global.scale==0.77?0.85:global.scale), 
                        alignSelf:'center', 
                        justifyContent:'center'}} 
                      numberOfLines={1}>
                      {global.NumberFormat(parseFloat(item.price).toFixed(2))}
                    </Text>
                    <Text style={[styles.txtPrice,{marginTop:-3}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.sprice).toFixed(2))} </Text>
                    </View>:
                    parseInt(item.price)>0?
                    <View>
                      <Text style={[styles.txtPrice,{marginTop:-3}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.price).toFixed(2))} </Text>
                    </View>:null
                  }
              </View>
          </TouchableOpacity>
        )
      // }else{
      //   return(
      //     <TouchableOpacity 
      //       onPress={()=>this.setSelect(index, item.product_option_id, item.product_option_value, item.option_id)}
      //       style={{flexDirection:'row',padding:5, justifyContent:'center', alignItems:'center', flex:1, margin:2, borderWidth:1, borderColor:global.styles.ruby, height:50}}>
      //       {parseInt(item.points)>=1?
      //       <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
      //         <Icon type='Octicons' name="ruby" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3  }}/>
      //           <Text style={[styles.txtPrice,{marginTop:-5}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.points))} </Text>
      //       </View>:null
      //       }
      //       {parseInt(item.price)>=1 && parseInt(item.points)>=1?
      //         <View>
      //           <Icon type='AntDesign' name='plus' style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3, marginLeft:2, marginRight:4}}/>
      //         </View>:null
      //       }
      //       {parseInt(item.price)>=1?
      //       <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
      //         <Icon type='FontAwesome' name="money" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3 }}/>
      //           <Text style={[styles.txtPrice,{marginTop:-5}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.price).toFixed(2))} </Text>
      //       </View>:null
      //       }
      //     </TouchableOpacity>
      //   )
      // }
    }else{
      return(
        <View></View>
      )
    }
  }
  
  render() { 
    this.showMore = !(this.state.onpress||(this.state.onSelected && this.props.options.length < 2)||(!this.state.onSelected && this.props.options.length < 3));
    return (
      <View style={styles.container}>
        <View
          style={{flex:1}}
          ref={view => this.Wrapper = view}
          onLayout={() => this.measureRect()}
          onStartShouldSetResponder={() => {
            console.log('View pressed the backdrop!');
            return true;
          }}
          onResponderRelease={(evt) => {
            if(this.showMore)
              this.setState({onpress:true})
              console.log('View onResponderRelease!', evt.nativeEvent.locationX, evt.nativeEvent.locationY, evt.nativeEvent.pageX, evt.nativeEvent.pageY);
          }}
          // onPress={()=>this.setState({onpress:true})}
          >
          <FlatList
            contentContainerStyle={{flex:1, width:'100%'}}
            data={this.props.options}
            numColumns={2}
            renderItem={({item, index}) =>this.renderPrice({item, index}, false)}
            />
          <View style={{ alignItems:'center', justifyContent:'center', opacity:this.showMore?1:0}} >
            <Icon type='AntDesign' name='down'  style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3  }}/>
          </View>
        </View>
        <Modal
          visible={this.state.onpress}
          transparent
          style={{}}
          onRequestClose={()=>this.setState({onpress:false})}
          >
           <Animated.View
            style={[styles.overlay,{flex:1,alignItems:'center',justifyContent:'center', backgroundColor:'#ffffff00'}]}
            onStartShouldSetResponder={() => {
              console.log('Animated View pressed the backdrop!');
              this.setState({onpress:false});
              return true;
            }}
            onResponderRelease={this.blur}
          >
          <View 
            style={{
              position:'absolute', 
              backgroundColor:'#fff',
              width:this.state.width,
              paddingBottom:5, 
              top:this.state.top - 22 - (this.props.offset.y>0?this.props.offset.y:0)}}>
            <View
              style={{flex:1}}
              onStartShouldSetResponder={() => {
                return true;
              }}
              >
              <FlatList
                contentContainerStyle={{flex:1, width:'100%'}}
                data={this.props.options}
                numColumns={2}
                renderItem={({item, index}) =>this.renderPrice({item, index}, true)}
                />
            </View>
          </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}
 
export default connect()(PriceOptions);