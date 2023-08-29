import React, { Component } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
 } from 'react-native';
import { connect } from 'react-redux';
 
import { fetchData } from '../actions/fetch'
import I18n from '../langs';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
 
class FavView extends Component {

  toAdd(sku){
    this.props.fetchData({
      next:'FETCH_ADD_FAV_SUCCESS', 
      rejected:'FETCH_ADD_FAV_ERROR', 
      method:'POST',
      url:'wishlist/add/'+sku, 
      data:{
        'token':this.props.user.user.token,
        'tokenExpired':this.props.user.user.tokenExpired,
        "lang": I18n.currentLocale()
      },
      callback:(data, isError)=>{
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 200);
        }else{
          if(this.props.onAdded)
            this.props.onAdded();
        }
      }
    });
  }

  render() { 
    return (
      <TouchableOpacity
        style={{marginLeft:10, marginRight:10}}
        onPress={()=>this.toAdd(this.props.sku)}
        >
        <Image source={require('../images/btn_add_to_fav.png')} style={{width:40, height:40}} />
      </TouchableOpacity>
    );
  }
}
 
const mapStateToProps = ({ user }) => ({ user })
export default connect( mapStateToProps, {fetchData})(FavView);
