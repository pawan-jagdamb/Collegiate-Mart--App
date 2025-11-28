import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import MyProducts from '../screens/MyProducts';
import ProfileScreen from '../screens/ProfileScreen';
import ProductItem from '../screens/ProductItem';
import { HomeStackParamList } from './types';

const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen 
        name="ProductItem" 
        component={ProductItem}
        options={{ 
          headerShown: false,
          animation: 'slide_from_right' 
        }} 
      />
    </HomeStack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
   <Drawer.Navigator >
    <Drawer.Screen name='Home' component={HomeStackNavigator}/>
    <Drawer.Screen name = 'Profile' component={ProfileScreen}/>
    <Drawer.Screen name= 'MyProduct' component={MyProducts}/>

   </Drawer.Navigator>
  )
}

export default DrawerNavigator

const styles = StyleSheet.create({})