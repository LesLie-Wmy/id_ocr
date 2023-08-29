import React, { PureComponent } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Animated,
  FlatList,
  Image
 } from 'react-native';
 import {
  Icon,
  Card
 } from 'native-base'
import { connect } from 'react-redux';
import I18n from '../langs';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 
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

  // renderPrice({item, index}, all){
  //   if((index<2 && !this.state.onSelected && !all) || 
  //      (index==this.state.onSelectedIndex && this.state.onSelected  && !all) ||
  //      (this.state.onSelected && index!=this.state.onSelectedIndex && all) ||
  //      (!this.state.onSelected && index>1 && all)
  //      ){
  //     // if(item.sprice){
  //       return(
  //         <TouchableOpacity
  //           onPress={()=>this.setSelect(index, item.product_option_id, item.product_option_value, item.option_id)}
  //           style={{flexDirection:'row',padding:5, justifyContent:'center', alignItems:'center', flex:1, margin:2, borderWidth:1, borderColor:global.styles.ruby, height:50}}>
            
  //             <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
  //             {parseInt(item.spoints)>=1 || parseInt(item.points)>0? <Icon type='Octicons' name="ruby" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3 }}/>:null}
  //               {parseInt(item.spoints)>=1?
  //                 <View>
  //                   <Text 
  //                     style={{
  //                       textDecorationLine:'line-through', 
  //                       color:'#ccc',
  //                       fontSize:12 * (global.scale==0.77?0.85:global.scale), 
  //                       alignSelf:'center', 
  //                       justifyContent:'center'}} 
  //                     numberOfLines={1}>
  //                     {global.NumberFormat(parseInt(item.points))}
  //                   </Text>
  //                   <Text style={[styles.txtPrice,{marginTop:-4}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.spoints))} </Text>
  //                 </View>:
  //                 parseInt(item.points)>0?
  //                 <View>
  //                 <Text style={[styles.txtPrice,{marginTop:-4}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.points))} </Text>
  //                 </View>:null
  //               }
  //             </View>
  //           {parseInt(item.price)>=1 && parseInt(item.points)>=1?
  //             <View>
  //               <Icon type='AntDesign' name='plus' style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3, marginLeft:2, marginRight:4  }}/>
  //             </View>:null
  //           }
            
  //             <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center', marginLeft:2}}>
  //             {parseInt(item.sprice)>0 || parseInt(item.price)>0 ? <Icon type='FontAwesome' name="money" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3 }}/>:null}
  //                 {parseInt(item.sprice)>0?
  //                   <View>
  //                     <Text 
  //                     style={{
  //                       textDecorationLine:'line-through', 
  //                       color:'#ccc',
  //                       fontSize:12 * (global.scale==0.77?0.85:global.scale), 
  //                       alignSelf:'center', 
  //                       justifyContent:'center'}} 
  //                     numberOfLines={1}>
  //                     {global.NumberFormat(parseFloat(item.price).toFixed(2))}
  //                   </Text>
  //                   <Text style={[styles.txtPrice,{marginTop:-3}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.sprice).toFixed(2))} </Text>
  //                   </View>:
  //                   parseInt(item.price)>0?
  //                   <View>
  //                     <Text style={[styles.txtPrice,{marginTop:-3}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.price).toFixed(2))} </Text>
  //                   </View>:null
  //                 }
  //             </View>
  //         </TouchableOpacity>
  //       )
  //     // }else{
  //     //   return(
  //     //     <TouchableOpacity 
  //     //       onPress={()=>this.setSelect(index, item.product_option_id, item.product_option_value, item.option_id)}
  //     //       style={{flexDirection:'row',padding:5, justifyContent:'center', alignItems:'center', flex:1, margin:2, borderWidth:1, borderColor:global.styles.ruby, height:50}}>
  //     //       {parseInt(item.points)>=1?
  //     //       <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
  //     //         <Icon type='Octicons' name="ruby" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3  }}/>
  //     //           <Text style={[styles.txtPrice,{marginTop:-5}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.points))} </Text>
  //     //       </View>:null
  //     //       }
  //     //       {parseInt(item.price)>=1 && parseInt(item.points)>=1?
  //     //         <View>
  //     //           <Icon type='AntDesign' name='plus' style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3, marginLeft:2, marginRight:4}}/>
  //     //         </View>:null
  //     //       }
  //     //       {parseInt(item.price)>=1?
  //     //       <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
  //     //         <Icon type='FontAwesome' name="money" style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3 }}/>
  //     //           <Text style={[styles.txtPrice,{marginTop:-5}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.price).toFixed(2))} </Text>
  //     //       </View>:null
  //     //       }
  //     //     </TouchableOpacity>
  //     //   )
  //     // }
  //   }else{
  //     return(
  //       <View></View>
  //     )
  //   }
  // }

  renderPrice({item, index}, all){
    let color;
    if(this.state.onSelectedIndex == index){
      color = global.colors.btn.pricePlanActive;
    }else{
      color = global.colors.btn.pricePlan;
    }
    return(
    <TouchableOpacity 
      onPress={()=>this.setSelect(index, item.product_option_id, item.product_option_value, item.option_id)}
      style={[styles.priceSelector,{marginTop:20}]}
      >
      <View style={[styles.triangle,{borderBottomColor:color}]} />
      <View style={[styles.priceTxtRow,{backgroundColor:color,}]}>
          <View style={{flexDirection:'row', position:'absolute', left:-22, top:0}}>
            <View style={styles.triangle2} />
            <View style={styles.rec}>
              <Text style={{color:color, fontSize:30}}>{alphabet[index]}</Text>
            </View>
            <View style={[styles.triangle2, {transform: [{rotate: '90deg'}]}]} />
          </View>
          {this.rederPriceValue(item)}
          {/* <Text style={{fontSize:20, color:global.colors.text.t1}}>$100</Text> */}
        </View>
      <View style={[styles.triangle, {transform: [{rotate: '90deg'}], borderBottomColor:color}]} />
    </TouchableOpacity>
    )
  }

  rederPriceValue(item){
    return(
      <View style={{flexDirection:'row', paddingLeft:35}} >
          <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
          {parseInt(item.spoints)>=1 || parseInt(item.points)>0? <Image source={require('../images/icon_points_w.png')} style={{width:26*0.8, height:23*0.8}} />:null}
            {parseInt(item.spoints)>=1?
              <View  style={{marginLeft:0}}>
                <Text 
                  style={{
                    textDecorationLine:'line-through', 
                    color:'#defde3',
                    fontSize:12 * (global.scale==0.77?0.85:global.scale),  
                    alignSelf:'flex-start',
                    marginLeft:5,
                    marginBottom:-2,
                    justifyContent:'center'}} 
                  numberOfLines={1}>
                  {global.NumberFormat(parseInt(item.points))}
                </Text>
                <Text style={[styles.txtPrice,{marginTop:-6}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.spoints))} </Text>
              </View>:
              parseInt(item.points)>0?
              <View>
              <Text style={[styles.txtPrice,{marginTop:0}]} numberOfLines={1}> {global.NumberFormat(parseInt(item.points))} </Text>
              </View>:null
            }
          </View>
        {parseInt(item.price)>=1 && parseInt(item.points)>=1?
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <Icon type='AntDesign' name='plus' style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.colors.text.t1, marginBottom:3, marginLeft:-1, marginRight:-1  }}/>
          </View>:null
        }
        
          <View  style={{flexDirection:'row', alignItems:'center',  justifyContent:'center', marginLeft:2}}>
          {parseInt(item.sprice)>0 || parseInt(item.price)>0 ? <Text style={styles.txtPrice}>HK$</Text> :null}
              {parseInt(item.sprice)>0?
                <View style={{marginLeft:-4}}>
                  <Text 
                  style={{
                    textDecorationLine:'line-through', 
                    color:'#defde3',
                    fontSize:12 * (global.scale==0.77?0.85:global.scale), 
                    alignSelf:'flex-start',
                    marginLeft:5,
                    marginBottom:-2,
                    justifyContent:'center'}} 
                  numberOfLines={1}>
                  {global.NumberFormat(parseFloat(item.price).toFixed(2))}
                </Text>
                <Text style={[styles.txtPrice,{marginTop:-6}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.sprice).toFixed(2))} </Text>
                </View>:
                parseInt(item.price)>0?
                <View style={{marginLeft:-4}}>
                  <Text style={[styles.txtPrice,{marginTop:0}]} numberOfLines={1}> {global.NumberFormat(parseFloat(item.price).toFixed(2))} </Text>
                </View>:null
              }
          </View>
        </View>
    )
  }

  renderPriceContent(){
    if(this.state.onSelected){
      return(
        <View style={[styles.priceTxtRow,{backgroundColor:global.colors.btn.pricePlanActive}]}>
          <View style={{flexDirection:'row', position:'absolute', left:-22, top:0}}>
            <View style={styles.triangle2} />
            <View style={styles.rec}>
              <Text style={{color:global.colors.text.a1, fontSize:30}}>{alphabet[this.state.onSelectedIndex]}</Text>
            </View>
            <View style={[styles.triangle2, {transform: [{rotate: '90deg'}]}]} />
          </View>
          {this.rederPriceValue(this.props.options[this.state.onSelectedIndex])}
        </View>
      )
    }else{
      return(
        <View style={[styles.priceTxtRow,{backgroundColor:global.colors.btn.pricePlan}]}>
          <Text style={{fontSize:20, color:global.colors.text.t1}}>{I18n.t('Select Your Price')}</Text>
        </View>
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
          {/* <FlatList
            contentContainerStyle={{flex:1, width:'100%'}}
            data={this.props.options}
            numColumns={2}
            renderItem={({item, index}) =>this.renderPrice({item, index}, false)}
            />
          <View style={{ alignItems:'center', justifyContent:'center', opacity:this.showMore?1:0}} >
            <Icon type='AntDesign' name='down'  style={{fontSize: 18 * (global.scale==0.77?0.85:global.scale), color: global.styles.ruby, marginBottom:3  }}/>
          </View> */}
          <TouchableOpacity 
            onPress={()=>this.setState({onpress:true})}
            style={styles.priceSelector}
            >
            <View style={[styles.triangle,{borderBottomColor:this.state.onSelected?global.colors.btn.pricePlanActive:global.colors.btn.pricePlan}]} />
              {this.renderPriceContent()}
            <View style={[styles.triangle, {transform: [{rotate: '90deg'}], borderBottomColor:this.state.onSelected?global.colors.btn.pricePlanActive:global.colors.btn.pricePlan}]} />
            <Image source={require('../images/btn_search-1.png')} style={{width:23, alignSelf:'center', height:22, position:'absolute', right:40}}/>
          </TouchableOpacity>
        </View>
        <Modal
          visible={this.state.onpress}
          transparent
          style={{flex:1}}
          onRequestClose={()=>this.setState({onpress:false})}
          >
          <View style={{
            width:'100%',
            height:'100%',
            justifyContent:'center', 
            alignItems:'center',
          }}>
              <Card style={{
                backgroundColor:'#fff',
                width:'94%',
                height:'60%',
                alignSelf:'center',
                borderRadius:20,
              }}>
              <View
                style={{
                  flex:1,
                  justifyContent:'center', 
                  alignItems:'center',
                  marginTop:15
                  }}
                >
                <Text style={{color:global.colors.text.d1, fontSize:20}}>{I18n.t('Please choose a plan')}</Text>
                <View style={{flexDirection:'row', marginTop:10, marginBottom:10}}>
                  <Image source={require('../images/icon_point_max.png')} style={{width:34*0.8, height:30*0.8}} />
                  <Text style={{color:global.colors.text.d1, fontSize:20}}> {I18n.t('Valid Points')}{global.NumberFormat(this.props.user.user.points)}</Text>
                </View>
                <FlatList
                  style={{width:'100%'}}
                  data={this.props.options}
                  numColumns={1}
                  renderItem={({item, index}) =>this.renderPrice({item, index}, true)}
                  />
            </View>
          </Card>
          </View>
          
        </Modal>
      </View>
    );
  }
}

 
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
    fontSize: 20 * (global.scale==0.77?0.85:global.scale),
    color:global.colors.text.t1,
    alignSelf:"center",
    justifyContent: "center",
    textAlign: "center"
  },
  priceSelector:{
    flex:1,
    flexDirection:'row',
    justifyContent: "center",
    textAlign: "center"
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop:18,
    borderBottomColor: global.colors.btn.pricePlan,
    transform: [
      {rotate: '-90deg'}
    ]
  },
  triangle2:{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop:19,
    borderBottomColor: global.colors.background.body,
    transform: [
      {rotate: '-90deg'}
    ]
  },
  rec:{
    marginTop:6,
    marginLeft:-14.5,
    marginRight:-14.5,
    height:39,
    width:30,
    backgroundColor: global.colors.background.body,
    justifyContent:'center',
    alignItems:'center'
  },
  priceTxtRow:{
    marginLeft:-17.5,
    marginRight:-17.5,
    height:50,
    flex:1,
    backgroundColor: global.colors.btn.pricePlan,
    justifyContent:'center',
    alignItems:'center'
  }
});
 
const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps, {})(PriceOptions);