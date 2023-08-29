import React, { Component } from 'react';
import { 
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  Icon
} from 'native-base';
import { connect } from 'react-redux';
import { fetchData } from '../../actions/fetch';
import I18n from '../../langs';
import MyHeader from '../../component/MyHeader';
import Statusbar from '../../component/Statusbar';
import ImageRP from "../../component/ResponsiveImage";
import RenderPrice from '../../component/RenderPrice';

const win = Dimensions.get("window");


class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist:[],
      allLoaded:false,
      text:I18n.t("Loading")
    };
  }

  componentDidMount(){
    this._fetchWishList();
  }

  _fetchWishList(){
    this.props.fetchData({
      next:'FETCH_ORDER_HISTORY_SUCCESS', 
      rejected:'FETCH_ORDER_HISTORY_ERROR', 
      method:'POST',
      url:'wishlist/get', 
      data:{
        'token':this.props.user.user.token,
        'tokenExpired':this.props.user.user.tokenExpired,
        "lang": I18n.currentLocale(),
        "page": 1,
        "size": 10
      },
      callback:(data, isError) => {
        if(isError){
          setTimeout(() => {
            Alert.alert(I18n.t(data.message, {defaultValue: data.message}));
          }, 200);
        }else{
          if(data.data.items && data.data.items.length > 0){
            this.setState({
              allLoaded:true,
              wishlist:data.data.items
            });
          }else{
            this.setState({
              allLoaded:true,
              text:I18n.t("No Record Found"),
              wishlist:[]
            });
          }
        }
      }
    });
  }

  updateWishlist(data, isError){
    
  }

  _renderWishlistItem(item){
    let product = item.item.product;
    return (
      <Card>
        <CardItem>
          <Left>
            <ImageRP source={global.storeMediaURL + 'catalog/product' + product.image} style={{ width:120, height:120, resizeMode:'contain' }} />
          </Left>
          <Body style={{ justifyContent:'space-around',}}>
            <Text style={{ fontSize:22, color:'grey', }}>{product.name}</Text>
            <View style={{flex:1, marginTop:5, marginBottom:5, marginLeft:5, flexDirection:'row', justifyContent:'flex-end', marginRight:3}}>
              <RenderPrice
                uFontSize={12 * global.scale}
                fontSize={18 * global.scale}
                price={product.price}
                sprice={product.special_price}
                oldPriceTxt={{alignSelf:'flex-end', textAlign:'right'}}
                from={product.special_from_date}
                to={product.special_to_date}
                dateNow={global.dateNow}
              />
              {
                product.type_id=="configurable"
                ?
                <Text>+</Text>
                :
                null
              }
            </View>
          </Body>
        </CardItem>
      </Card>
    );
  }

  render() {
    return (
      <Container>
        <Statusbar backgroundColor={global.colors.background.statusBar}/>
        <View style={{ backgroundColor:global.colors.background.statusBar}}>
          <MyHeader title={I18n.t("WishList")} titleColor={global.colors.text.t1}/>
        </View>
        <Content>
        {
          this.state.wishlist.length > 0
          ?
          <FlatList 
            style={{width:win.width,}}
            scrollEnabled={true}
            contentContainerStyle={styles.list_container}
            // data={ this.props.wishlist }
            data={this.state.wishlist}
            renderItem={ this._renderWishlistItem }
          />
          :
          <View style={{flex:1, alignItems:'center', marginTop:10}}>
            <Text style={{color:global.colors.text.t2}}>-- {this.state.text} --</Text>
          </View>
        }
          
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});

const mapStateToProps = ({ wishlist, user }) => ({ wishlist, user });
export default connect( mapStateToProps, { fetchData })(WishList);