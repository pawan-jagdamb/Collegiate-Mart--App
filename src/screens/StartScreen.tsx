import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../theme/themeColors'
import { useNavigation } from '@react-navigation/native'
import { StartScreenNavigationProp } from '../navigation/types'
import { Toast } from 'toastify-react-native'


const StartScreen = () => {
  const navigation = useNavigation<StartScreenNavigationProp>()
  const handleSignUp = () => {
    navigation.navigate('Signup')
  }
  const handleLogin = () => {
    navigation.navigate('Login')
  }
  return (
    <SafeAreaView className='flex-1 ' style={styles.container}>
        <View className='flex-1 justify-around my-4 '>
          <Text className='text-center text-white text-4xl font-bold'>Let 's Get Started

          </Text>
          <View className='flex-row justify-center'>
            <Image source={require('../assets/welcomeImage.png')}   style={{width: 350, height: 350}}/>

          </View>
          <View className='space-y-4'>
            <TouchableOpacity
            className='py-3 bg-yellow-400 mx-7 rounded-xl'
            onPress={handleSignUp}
            >
              <Text className='text-center text-white text-xl font-bold'>Sign Up</Text>
            </TouchableOpacity>
            <View className='flex-row justify-center mt-4'>
            <Text className='text-center text-white text-sm'>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text className='text-yellow-400 font-bold'>Login</Text>
            </TouchableOpacity>
          </View>
          </View>
          
        </View>

    </SafeAreaView>

  )
}

export default StartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  }
})