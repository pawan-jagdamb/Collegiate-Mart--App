import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import StartScreen from '../screens/StartScreen';
import LoginInScreen from '../screens/LoginInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProductScreen from '../screens/ProductScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigation = () => {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Start">
        <Stack.Screen name="Start" options={ { animation: 'fade' ,headerShown: false}} component={StartScreen} />
        <Stack.Screen name="Login" options={ { animation: 'fade' ,headerShown: false}} component={LoginInScreen} />
        <Stack.Screen name="Signup" options={ { animation: 'fade' ,headerShown: false}} component={SignUpScreen} />
        <Stack.Screen name="Product" options={{ animation: 'slide_from_right', headerShown: false }} component={ProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  )
}

export default AppNavigation

const styles = StyleSheet.create({})