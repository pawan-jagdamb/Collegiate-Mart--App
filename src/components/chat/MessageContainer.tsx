import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { setSelectedUser } from '../../redux/slice/userSlice'
import Messages from './Messages'
import SendInput from './SendInput'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'

const MessageContainer = () => {
  const dispatch = useDispatch()
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const onlineUsers = useSelector((state: RootState) => state.user.onlineUsers) as Array<{ _id?: string }> | null
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const handleBack = () => {
    dispatch(setSelectedUser(null))
  }

  useEffect(() => {
    const keyboardEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const keyboardShowListener = Keyboard.addListener(keyboardEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height)
    })

    const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => {
      setKeyboardHeight(0)
    })

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  const isOnline: boolean = Boolean(
    selectedUser?._id && 
    onlineUsers?.some((user) => user._id === selectedUser._id)
  )

  // Get avatar URL
  let avatarUrl = ''
  if (selectedUser?.avatar) {
    if (Array.isArray(selectedUser.avatar)) {
      avatarUrl = selectedUser.avatar.join('')
    } else if (typeof selectedUser.avatar === 'string') {
      avatarUrl = selectedUser.avatar
    }
  }

  const avatarSource = avatarUrl
    ? { uri: avatarUrl }
    : require('../../assets/topi.jpeg')

  if (selectedUser === null) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Hi, {(currentUser?.userName as string) || 'User'}</Text>
        <Text style={styles.emptySubtitle}>Let's start Conversation</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
      enabled={Platform.OS === 'ios'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          {isOnline && <View style={styles.onlineIndicator} />}
          <Image source={avatarSource} style={styles.avatar} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {(selectedUser.userName as string) || 'Unknown User'}
          </Text>
        </View>
        <Text style={styles.status}>{isOnline ? 'online' : 'offline'}</Text>
      </View>
      <View style={styles.keyboardView}>
        <View style={[
          styles.messagesContainer,
          keyboardHeight > 0 && { paddingBottom: keyboardHeight + 80 }
        ]}>
          <Messages />
        </View>
        <View style={[
          styles.inputWrapper,
          keyboardHeight > 0 && {
            bottom: keyboardHeight,
          }
        ]}>
          <SendInput />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default MessageContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#111827',
  },
  keyboardView: {
    flex: 1,
    position: 'relative',
  },
  messagesContainer: {
    flex: 1,
    paddingBottom: 80, // Space for input field when keyboard is closed
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#1F2937',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  status: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 18,
    color: '#9CA3AF',
  },
})

