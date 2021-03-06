import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen   from '../screens/HomeScreen';
import LinksScreen  from '../screens/LinksScreen';
import DetailScreen from "../screens/Detail";

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  LinkScreen: LinksScreen,
  Detail: DetailScreen

}, {initialRouteName:"Home"});

export default HomeStack;

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};
