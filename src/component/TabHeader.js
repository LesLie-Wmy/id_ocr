//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// create a component
class TabHeading extends Component {
  render() {
    return (
      <View style={styles.container}>
      {this.props.tabs.map((name, page) => {
        const isTabActive = this.props.activeTab === page;
        const renderTab = this.props.renderTab || this.renderTab;
        return renderTab(
          name,
          page,
          isTabActive,
          this.props.goToPage,
          this.props.tabStyle[page],
          this.props.activeTabStyle[page],
          this.props.textStyle[page],
          this.props.activeTextStyle[page],
          this.props.tabHeaderStyle[page]
        );
        }
      )} 
      </View>
    )
  }

  renderTab(
    name,
    page,
    isTabActive,
    onPressHandler,
    tabStyle,
    activeTabStyle,
    textStyle,
    activeTextStyle,
    tabHeaderStyle
  ) {
    const headerContent = typeof name !== "string" ? name.props.children : undefined;
    const fontWeight = isTabActive ? "bold" : "normal";
    const underline = {borderBottomColor:activeTextStyle.color, borderBottomWidth:2, padding:4, paddingTop: 0, paddingBottom: 2};
    if (typeof name === "string") {
      return (
        <TouchableOpacity style={styles.tabBarWrap} key={name} onPress={() => onPressHandler(page)}>
          <View style={isTabActive ? [activeTabStyle, underline] : tabStyle} active={isTabActive}>
            <Text style={isTabActive ? activeTextStyle : textStyle}>{name}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.tabBarWrap} key={_.random(1.2, 5.2)} onPress={() => onPressHandler(page)}>
          <View style={tabHeaderStyle} active={isTabActive}>
            {headerContent}
          </View>
        </TouchableOpacity>
      );
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#7f96d6',
  },
  tabBarWrap:{
    padding: 10,
    flex: 1,
    // backgroundColor:'#00c5ff',
    // backgroundColor:'#ee8d8d',
    backgroundColor:'#B593FE',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarTxt:{
    // backgroundColor: '#7f96d6',
    backgroundColor: '#cccccc',
  }
});

//make this component available to the app
export default TabHeading;
