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
      <SafeAreaView style={styles.safeArea}>
        <View>
          <Text className='text-white'>App</Text>
        </View>
      </SafeAreaView>
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