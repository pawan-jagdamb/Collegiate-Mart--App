import { StyleSheet, View } from 'react-native'
import React from 'react'
import Sidebar from '../components/chat/Sidebar'
import MessageContainer from '../components/chat/MessageContainer'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'

const ChatScreen = () => {
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser)

  return (
    <View style={styles.container}>
      {selectedUser ? <MessageContainer /> : <Sidebar />}
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
})
