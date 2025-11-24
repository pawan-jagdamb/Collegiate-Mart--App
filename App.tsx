import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import "./global.css"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppNavigation from './src/navigation/AppNavigation'

const App = () => {
  useEffect(()=>{
    SplashScreen.hide()
  },[])
  return (
    <SafeAreaProvider>
      <AppNavigation/>
    </SafeAreaProvider>
    
    
  )
}

export default App

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
})