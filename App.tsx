import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import "./global.css"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppNavigation from './src/navigation/AppNavigation'
import ToastManager from 'toastify-react-native'
import { Provider } from 'react-redux'
import { store ,persistor} from './src/redux/store/store'
import { PersistGate } from 'redux-persist/integration/react'
const App = () => {
  useEffect(()=>{
    SplashScreen.hide()
  },[])
  return (
    // <View>
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigation/>
          <ToastManager/>
        </PersistGate>
      </Provider>
    </>

   
    
   
    
    
  )
}

export default App

