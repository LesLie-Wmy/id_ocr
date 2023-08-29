//import libraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Alert
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Card,
  CardItem,
} from 'native-base'
import { Actions, ActionConst } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { fetchingData } from '../../actions/fetch';
import I18n from '../../langs';
import Statusbar from '../../component/Statusbar'
import MyHeader from '../../component/MyHeader'
import Loading from '../../component/loading';
import OrderHistoryWrap from './OrderHistoryWrap';

// create a component
class OrderHistory extends Component {
  render() {
    console.log(global.scale);
    return (
      <Container style={styles.container}>
        <Statusbar  backgroundColor={global.colors.background.statusBar}/>
        <OrderHistoryWrap/>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

//make this component available to the app
const mapStateToProps = ({ Lang }) => ({ Lang });
export default connect(mapStateToProps, { fetchingData }, null, { forwardRef: true })(OrderHistory);
