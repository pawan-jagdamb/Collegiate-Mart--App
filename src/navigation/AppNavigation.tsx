import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootStackParamList } from './types';
import StartScreen from '../screens/StartScreen';
import LoginInScreen from '../screens/LoginInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProductScreen from '../screens/ProductScreen';
import HomeScreen from '../screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';
import { RootState } from '../redux/store/store';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigation = () => {
  const token = useSelector((state: RootState) => state.auth.token)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const initialRoute = useMemo(() => {
    if (token && currentUser) {
      return 'Drawer'
    }
    return 'Start'
  }, [token, currentUser])

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Start" options={ { animation: 'fade' ,headerShown: false}} component={StartScreen} />
        <Stack.Screen name="Login" options={ { animation: 'fade' ,headerShown: false}} component={LoginInScreen} />
        <Stack.Screen name="Signup" options={ { animation: 'fade' ,headerShown: false}} component={SignUpScreen} />
        <Stack.Screen name="Drawer" options={{ animation: 'slide_from_right', headerShown: false }} component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  )
}

export default AppNavigation

const styles = StyleSheet.create({})