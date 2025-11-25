import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import "./global.css"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppNavigation from './src/navigation/AppNavigation'
import ToastManager from 'toastify-react-native'

const App = () => {
  useEffect(()=>{
    SplashScreen.hide()
  },[])
  return (
    // <View>
    <>
      <AppNavigation/>
      <ToastManager/>
    </>

   
    
   
    
    
  )
}

export default App

