import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { setMessages, addMessage, updateMessage, removeMessage } from '../../redux/slice/messageSlice'
import { apiConnector } from '../../services/apiConnector'
import { endpoints } from '../../services/apis'
import { PaperAirplaneIcon } from 'react-native-heroicons/solid'

const SendInput = () => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const messages = useSelector((state: RootState) => state.message.messages) as Array<{
    _id?: string
    message?: string
    senderId?: string
    createdAt?: string
  }> | null
  const token = useSelector((state: RootState) => state.auth.token)

  const onSubmitHandler = async () => {
    if (!message.trim() || !selectedUser?._id || !token || !currentUser?._id) return

    const messageToSend = message.trim()
    // Clear input immediately
    setMessage('')

    // Create optimistic message to show immediately on sender's side
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      message: messageToSend,
      senderId: currentUser._id as string,
      receiverId: selectedUser._id as string,
      createdAt: new Date().toISOString(),
    }

    // Add optimistic message immediately
    dispatch(addMessage(optimisticMessage))

    try {
      const authToken = (currentUser as any)?.token || token

      const response = await apiConnector<{ success: boolean; newMessage?: any }>(
        'POST',
        `${endpoints.BASE_URL}/v1/message/send/${selectedUser._id}`,
        {
          message: messageToSend,
          token: authToken,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      )

      const data = response.data as { success: boolean; newMessage?: any }
      
      if (data.success) {
        // Replace optimistic message with actual message from server
        if (data.newMessage) {
          const actualMessage = {
            _id: data.newMessage._id || optimisticMessage._id,
            message: data.newMessage.message || messageToSend,
            senderId: data.newMessage.senderId || currentUser._id,
            receiverId: data.newMessage.receiverId || selectedUser._id,
            createdAt: data.newMessage.createdAt || optimisticMessage.createdAt,
          }
          
          // Replace the optimistic message with the actual one
          dispatch(updateMessage({ tempId: optimisticMessage._id, message: actualMessage }))
        } else {
          // If no newMessage in response, ensure senderId is set correctly
          const updatedMessage = {
            ...optimisticMessage,
            senderId: currentUser._id,
          }
          dispatch(updateMessage({ tempId: optimisticMessage._id, message: updatedMessage }))
        }
      } else {
        // If send failed, remove the optimistic message
        dispatch(removeMessage(optimisticMessage._id))
        setMessage(messageToSend) // Restore the message text
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      dispatch(removeMessage(optimisticMessage._id))
      setMessage(messageToSend) // Restore the message text
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Send a Message"
          placeholderTextColor="#9CA3AF"
          multiline
          blurOnSubmit={false}
          returnKeyType="send"
          onSubmitEditing={onSubmitHandler}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSubmitHandler}
          activeOpacity={0.7}
        >
          <PaperAirplaneIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SendInput

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

