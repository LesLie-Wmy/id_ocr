//import liraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList as RNFlatList,
  ActivityIndicator,
  Dimensions
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

    this.gestureHandlers = {
			onStartShouldSetResponder: () => true,
			onMoveShouldSetResponder: () => true,
			onResponderStart:() => {
				console.log('onResponderStart')
			},
			onResponderGrant: () => {
				console.log('onResponderGrant');
				this.setState({backgroundColor: 'green'})
			},
			onResponderMove: () => {
				console.log('onResponderMove')
			},
			onResponderEnd:() => {
				console.log('onResponderEnd')
			},
			onResponderRelease: () => {
				console.log('onResponderRelease')
				this.setState({backgroundColor: 'blue'})
			},
			onResponderTerminationRequest: () => {
				console.log('onResponderTerminationRequest');
				return true;
			},
			onResponderTerminate: (evt) => {
				console.log('onResponderTerminate')
			}
		};
  }
  
  _onScroll (e) {

    // console.log("_onScroll");
    // const scrollPosition = event && event.nativeEvent && event.nativeEvent.contentOffset && event.nativeEvent.contentOffset.y;
    // let newBouncesValue;
    // let h = 0;
    // flatlistFooter
    // console.log(event.nativeEvent);
    // console.log((event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height - event.nativeEvent.contentSize.height));
    if((e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentSize.height) > -100){
      
      // if(global.InitData == global.InitDataCount){
        
        if(this.state.flatlistFooter<140){
          this.state.flatlistFooter+=20;
          // this.setState({
          //   flatlistFooter:h,
          // });
        }
        
        // this.props.UpdateRenderCategory()
      // }
      
    }

    if((e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentSize.height) > -1  && !this.state.onMomentumScroll){
      console.log((e.nativeEvent.contentOffset.y));
      this.refs.list.scrollToOffset({
        offset: e.nativeEvent.contentOffset.y -10,
        animated: false
     });
    }

    if(this.state.flatlistFooter >= 140 && this.state.onMomentumScroll){
      this.setState({
        Threshold:2,
      });
    }else if(this.state.flatlistFooter > 10 && this.state.onMomentumScroll){
        this.setState({
          Threshold:1,
        });
    }else{
      this.setState({
        Threshold:0,
      });
    }
  }

  onScrollEnd(e){
    // let offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEnd' ,e.nativeEvent);
    console.log("onScrollEnd");
    console.log((e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentSize.height));
    if((e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentSize.height) > -1){
      console.log((e.nativeEvent.contentOffset.y));
      this.refs.list.scrollToOffset({
        offset: e.nativeEvent.contentOffset.y -20,
        animated: true
     });
    }
    
    // if(this.state.Threshold && (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentSize.height) > 100 && this.state.onEndReached && !this.state.refreshing){
    if(this.state.flatlistFooter > 60 && !this.state.refreshing){
      this.setState({
        Threshold:0,
        flatlistFooter:0
      })
      setTimeout(() => {
        if(this.props.onLoadMore && !this.props.allLoaded)
          this.props.onLoadMore();
      }, 1000);
      // console.log('onScrollEnd',true);
    }else{
      this.setState({
        refreshing:false,
        Threshold:0,
        flatlistFooter:0
      })
    }
  }

  renderFooter(){
    let h = this.state.flatlistFooter;
    // if(this.state.onEndReached && this.state.Threshold==1 && !this.state.refreshing){
    if(this.state.Threshold==1 && !this.props.onFreshing && !this.props.allLoaded){
      return(
        <View style={[styles.flatListFoot,{height:h}, this.props.footerContainerStyle]}>
          <Text style={styles.flatListFootFont}>{I18n.t('Pull up to load more')}</Text>
          <Icon type='Ionicons' name="ios-arrow-dropup" style={[styles.flatListFootFont, {marginLeft:5, marginTop:2, fontSize:17}, this.props.footerFontStyle]} />
        </View>
      )
    }else if(this.state.Threshold==2 && !this.props.onFreshing && !this.props.allLoaded){
      return(
        <View style={[styles.flatListFoot,{height:h, }, this.props.footerContainerStyle]}>
          <Text style={[styles.flatListFootFont, this.props.footerFontStyle]}>{I18n.t('Release to load more')}</Text>
          <Icon type='Ionicons' name="ios-sync" style={[styles.flatListFootFont, {marginLeft:5, marginTop:2, fontSize:17}, this.props.footerFontStyle]} />
        </View>
      )
    }else if((this.state.Threshold==1 || this.state.Threshold==2) && this.props.allLoaded){
      return(
        <View style={[styles.flatListFoot,{height:h, }, this.props.footerContainerStyle]}>
          <Text style={[styles.flatListFootFont, this.props.footerFontStyle]}>{I18n.t('Not More Record')}</Text>
          <Icon type='Ionicons' name="md-done-all" style={[styles.flatListFootFont, {marginLeft:5, marginTop:2, fontSize:17}]} />
        </View>
      )
    }else if(this.props.onFreshing){
      return(
        <View style={[styles.flatListFoot,{height:h, }, this.props.footerContainerStyle]}>
          <Text style={[styles.flatListFootFont,{marginRight:5}, this.props.footerFontStyle]}>{I18n.t('Loading')}</Text>
          <ActivityIndicator 
            size={'small'}
            color={'gray'}
           />
        </View>
      )
    }else{
      return(
        <View style={{height:h, width:'100%'}}/>
      )
    }
  }

  render() {
    return (
      <RNFlatList
        ref='list'
        {...this.props}
        ListHeaderComponent={this.props.ListHeaderComponent}
        ListFooterComponent={this.renderFooter()}
        extraData={this.props.extraData}
        contentContainerStyle={this.props.contentContainerStyle}
        data={ this.props.data }
        renderItem={this.props.renderItem}
        style={this.props.style}
        onScroll={(e) => this._onScroll(e)}
        onScrollEndDrag={(e)=>this.onScrollEnd(e)}
        bounces={false}
        onMomentumScrollBegin={
          (e)=>{
            this.setState({
              onMomentumScroll:true
            });
          }
        }
        onScrollBeginDrag={
          (e)=>{
            this.setState({
              onMomentumScroll:true
            });
          }
        }
        onMomentumScrollEnd={(e)=>{
          this.setState({
            Threshold:0,
            flatlistFooter:0,
            onMomentumScroll:false
          })
          console.log('onMomentumScrollEnd...')
        }}
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
