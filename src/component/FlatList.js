//import liraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList as RNFlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Icon,
  Spinner
} from 'native-base'
// create a component
import I18n from '../langs';

const win = Dimensions.get("window")

class FlatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Threshold:0,
      refreshing:true,
      flatlistFooter:0,
      onMomentumScroll:false
    };
  }
  
  _onScroll(e){
    // let offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEnd' ,e.nativeEvent);
    // console.log("onScrollEnd");
    // console.log((e.nativeEvent.contentOffset.y));
    let y = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentSize.height;
    if(this.state.flatListState!=4){
      if(y > -0.1){
        this.setState({flatListState:3});
      }else if(this.state.flatListState > 1){
        this.setState({flatListState:2});
      }
    }
  }
  
  renderFooter(){
    if(this.props.allLoaded){
      switch (this.state.flatListState) {
        case 1:
          return(
            <View style={{width:'100%',height:10,justifyContent:'center', alignItems:'center'}}></View>
          )
          break;
        default:
          return(
            <View style={{width:'100%',height:100,justifyContent:'center', alignItems:'center'}}>
              <Text style={[styles.flatListFootFont, this.props.footerFontStyle]}>{I18n.t('Not More Record')}</Text>
              <Icon type='Ionicons' name="md-done-all" style={[styles.flatListFootFont, {marginLeft:5, marginTop:2, fontSize:17}]} />
            </View>
          )
          break;
      }
    }else{
      switch (this.state.flatListState) {
        case 1:
          return(
            <View style={{width:'100%',height:10,justifyContent:'center', alignItems:'center'}}></View>
          )
          break;
        case 2:
          return(
            <View style={{width:'100%',height:100,justifyContent:'center', alignItems:'center'}}>
              <Text style={styles.flatListFootFont}>{I18n.t('Pull up to load more')}</Text>
              <Icon type='Ionicons' name="ios-arrow-dropup" style={[styles.flatListFootFont, {marginLeft:5, marginTop:2, fontSize:17}, this.props.footerFontStyle]} />
            </View>
          )
          break;
        case 3:
          return(
            <View style={{width:'100%',height:100,justifyContent:'center', alignItems:'center'}}>
              <Text style={[styles.flatListFootFont, this.props.footerFontStyle]}>{I18n.t('Release to load more')}</Text>
              <Icon type='Ionicons' name="ios-sync" style={[styles.flatListFootFont, {marginLeft:5, marginTop:2, fontSize:17}, this.props.footerFontStyle]} />
            </View>
          )
          break;
        case 4:
          return(
            <View style={{width:'100%',height:100,justifyContent:'center', alignItems:'center'}}>
              <Text style={[styles.flatListFootFont,{marginRight:5}, this.props.footerFontStyle]}>{I18n.t('Loading')}</Text>
              <ActivityIndicator 
                size={'small'}
                color={'gray'}
              />
            </View>
          )
          break;
        default:
          return(
            <View/>
          )
          break;
      }
    }
  }

  updateFlatList(){
    if(this.state.flatListState<=3 && this.props.onLoadMore){
      let stateTmp = this.state.flatListState + 1;
      this.setState({flatListState:stateTmp});
    }
  }

  scrollEndFlatList(){
    if(this.state.flatListState==3 || this.state.flatListState==4){
      if(this.state.flatListState==3)
        this.props.onLoadMore();
      this.setState({flatListState:4});
    }else{
      this.setState({flatListState:0});
    }
  }

  onLoadedUpdate(){
    setTimeout(() => {
      this.setState({flatListState:0});
      console.log(this.state.flatListState);
    }, 2000);
  }

  scrollBeginFlatList(){
    if(this.state.flatListState<4){
      this.setState({flatListState:1});
    }
  }

  render() {
    return (
      <RNFlatList
        ref='list'
        {...this.props}
        ListHeaderComponent={this.props.ListHeaderComponent}
        // ListFooterComponent={this.renderFooter()}
        extraData={this.props.extraData}
        contentContainerStyle={this.props.contentContainerStyle}
        data={ this.props.data }
        renderItem={this.props.renderItem}
        style={this.props.style}
        refreshControl={
          this.props.onReloadData?
          <RefreshControl 
            refreshing={this.props.refreshing} 
            onRefresh={()=>this.props.onReloadData()} 
          />
          :
          null
        }
        ListFooterComponent={()=>this.renderFooter()}
        onEndReachedThreshold={0.01}
        onEndReached={()=>this.updateFlatList()}
        onScrollBeginDrag={(e)=>this.scrollBeginFlatList()}
        onScrollEndDrag={(e)=>this.scrollEndFlatList()}
        onScroll={(e) => this._onScroll(e)}
      />
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
    paddingBottom: 40,
  },
  flatListFoot:{
    width:win.width,
    justifyContent:'center',
    alignItems:'flex-start',
    flexDirection:'row',
    marginTop:5
  },
  flatListFootFont:{
    fontSize:14,
    color:'#ccc'
  }
});

//make this component available to the app
export default FlatList;
