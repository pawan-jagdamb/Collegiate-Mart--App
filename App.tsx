import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import "./global.css"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const App = () => {
  useEffect(()=>{
    SplashScreen.hide()
  },[])
  return (
    <SafeAreaProvider>
   
    <View>
      <Text className='text-white'>App</Text>
    </View>
    </SafeAreaProvider>
    
    
  )
}

export default App

const styles = StyleSheet.create({})