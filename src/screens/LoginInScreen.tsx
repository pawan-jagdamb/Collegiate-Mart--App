import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

const LoginInScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const passwordInputRef = useRef<TextInput>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT)
    } else {
      Alert.alert('', message)
    }
  }

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim())

  const handleBack = () => {
    navigation.goBack()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = () => {
    if (!email.trim()) {
      showToast('Please enter your email address.')
      return
    }

    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.')
      return
    }

    if (!password.trim()) {
      showToast('Please enter your password.')
      return
    }

    // TODO: Implement login logic
    console.log('Login attempted with:', { email, password })
    // navigation.navigate('Home') // Navigate after successful login
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Forgot password clicked')
    // navigation.navigate('ForgotPassword') // Navigate to forgot password screen
  }

  return (
    <View className='flex-1 bg-backgroundSecondary'>
      <SafeAreaView style={styles.topSection} className='flex-1'>
        <View className='flex-row justify-start pt-2'>
          <TouchableOpacity onPress={handleBack}
          className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4'
          >
            <ArrowLeftIcon color='black' size={20} />
          </TouchableOpacity>
        </View>
        <View className='flex-1 justify-center items-center'>
          <Image
           source={require('../assets/LoginImage.png')}
           style={{width: 200, height: 200}}
           />
        </View>
      </SafeAreaView>
      
      <KeyboardAvoidingView 
        style={styles.formWrapper}
        className='w-full'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View 
          className='bg-backgroundPrimary'
          style={[styles.formContainer, {paddingHorizontal: 28, paddingTop: 28, paddingBottom: 120}]}
        >
          <View className='form space-y-2 mb-4'>
            <Text className='text-gray-700 ml-4'>Email Address <Text className='text-red-500'>*</Text></Text>
            <TextInput
             className='bg-gray-400 p-4 rounded-2xl text-gray-700'
             placeholder='Enter your email address'
             placeholderTextColor='#9CA3AF'
             keyboardType='email-address'
             autoCapitalize='none'
             returnKeyType='next'
             value={email}
             onChangeText={setEmail}
             onSubmitEditing={() => passwordInputRef.current?.focus()}
             />
          </View>
          <View className='form space-y-2'>
            <Text className='text-gray-700 ml-4'>Password <Text className='text-red-500'>*</Text></Text>
            <View className='relative'>
              <TextInput
               ref={passwordInputRef}
               secureTextEntry={!showPassword}
               className='bg-gray-400 p-4 rounded-2xl text-gray-700 pr-12'
               placeholder='Enter your password'
               placeholderTextColor='#9CA3AF'
               value={password}
               onChangeText={setPassword}
               returnKeyType='done'
               onSubmitEditing={handleLogin}
               />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className='absolute right-4 top-4'
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeSlashIcon color='#6B7280' size={20} />
                ) : (
                  <EyeIcon color='#6B7280' size={20} />
                )}
              </TouchableOpacity>
            </View>
            <View className='flex-row justify-end mr-4'>
              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text className='text-black text-sm font-medium'>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleLogin}
            className='bg-yellow-400 py-3  rounded-xl mt-6'
            activeOpacity={0.8}
          >
            <Text className='text-center text-white text-xl font-bold'>Login</Text>
          </TouchableOpacity>
          <Text className='text-center text-black text-md mt-6 font-bold'> OR </Text>
          <View className='flex-row justify-center'>
            <TouchableOpacity className='p-2 bg-gray-100 rounded-2xl'>
              <Image source={require('../assets/Image/google.png')} className='w-10 h-10' />  
            </TouchableOpacity>

          </View>
          
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default LoginInScreen

const styles = StyleSheet.create({
  topSection: {
    flex: 0.5,
    width: '100%',
  },
  formWrapper: {
    flex: 0.9,
    width: '100%',
  },
  formContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
})