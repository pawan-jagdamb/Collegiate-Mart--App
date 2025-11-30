import { ActivityIndicator, FlatList, Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import useGetRealTimeMessage from '../../hooks/useGetRealTimeMessage'

const Messages = () => {
  useGetMessages()
  useGetRealTimeMessage()
  
  const messages = useSelector((state: RootState) => state.message.messages) as Array<{
    _id?: string
    message?: string
    senderId?: string
    createdAt?: string
  }> | null
  const flatListRef = useRef<FlatList>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  useEffect(() => {
    // Scroll to bottom when keyboard appears
    const keyboardEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const keyboardShowListener = Keyboard.addListener(keyboardEvent, (event) => {
      const height = event.endCoordinates.height
      setKeyboardHeight(height)
      // Scroll to bottom after a short delay to ensure layout is updated
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, Platform.OS === 'ios' ? 50 : 100)
    })

    const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => {
      setKeyboardHeight(0)
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    })

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  if (!messages) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#9CA3AF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    )
  }

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
        <Text style={styles.emptySubtext}>Start the conversation!</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 16 }
        ]}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }}
        onLayout={() => {
          if (keyboardHeight > 0) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true })
            }, 100)
          }
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />
    </View>
  )
}

export default Messages

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#9CA3AF',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
  },
})

