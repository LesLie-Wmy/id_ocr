//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';
import I18n from '../langs';
import { connect } from 'react-redux';
import { fetchingData } from '../actions/fetch';
import Loading from './loading'
import { Actions, ActionConst } from 'react-native-router-flux';

const NORTH_AMERICA = ['AF','AR','AM','AU','AT','BY','BE','BR','BN','KH','CA','CF','CL','CN','FR',
'GU','HK','HU','IS','IN','IR','IQ','IE','IL','IT','JP','KE','LA','LB','LY','MO','MK','MY','MV','MU','MX',
'MC','MA','MM','NA','NP','NL','NZ','NI','NE','KP','NO','PK','PS','PA','PY','PE','PH','PL','PT','RU','KR',
'ES','LK','SE','SY','TW','TH','TL','TN','TR','UA','AE','GB','US','UY','UZ','VU','VA','VN','ZW',"TAS","HI"]
// create a component
class CountrySelecter extends Component {
  constructor(props) {
    super(props);
    var CountryCode = 'US';
    switch (I18n.currentLocale()) {
      case 'zhHant':
        CountryCode = 'zht'
        break;
      case 'zhHans':
        CountryCode = 'zhs'
        break;
      default:
        break;
    }
    this.userLocaleCountryCode = CountryCode;
    const userCountryData = getAllCountries()
      .filter(country => NORTH_AMERICA.includes(country.cca2))
      .filter(country => country.cca2 === this.userLocaleCountryCode)
      .pop()
    let callingCode = null
    let cca2 = this.userLocaleCountryCode
    if (!cca2 || !userCountryData) {
      cca2 = 'US'
      callingCode = '1'
    } else {
      callingCode = userCountryData.callingCode
    }
    this.state = {
      cca2,
      callingCode,
      modalVisible:true,
    }

  }

  componentDidMount(){
    this.refs.picker.openModal();
  }

  find(value){
    this.props.fetchingData({
      next:'FIND_BY_COUNTRY_SUCCESS', 
      rejected:'FIND_BY_COUNTRY_ERROR', 
      method:'POST',
      url:'simHome.php', 
      data:{
        "code":value,
        "lang":I18n.currentLocale(),
        "action":"findByCountry"
      },
      callback:(data, isError)=>{
        this.Loading.hide();
        if(isError){
          setTimeout(() => {
            Alert.alert("",
              I18n.t('No Record Found'),
              [  
                {text:I18n.t('OK'), onPress:()=> Actions.pop()}
              ],
              {cancelable:false});
          }, 100);
        }else{
          setTimeout(() => {
            Actions.SimDetail({type:ActionConst.REPLACE ,...data.data, pname:data.data.name})
          }, 100)
        }
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, marginTop:20}}>
        <View style={styles.container}>
          <Loading ref={(Loading) => this.Loading = Loading} />
          <CountryPicker
            ref="picker"
            countryList={NORTH_AMERICA}
            autoFocusFilter={false}
            modalVisible={true}
            closeable={true}
            filterable={true}
            onChange={value => {
              this.find(value.cca2)
              // Actions.pop();
              // Actions.CountryView({ cca2: value.cca2, header: value.name});
              // this.setState({ cca2: value.cca2, callingCode: value.callingCode })
            }}
            onClose={()=>{
                Actions.pop();
              }
            }
            cca2={this.state.cca2}
            translation={this.userLocaleCountryCode}
          ><View/></CountryPicker>
        </View>
      </SafeAreaView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height:500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.styles.body,
  },
});

//make this component available to the app
export default connect(null, { fetchingData })(CountrySelecter);
