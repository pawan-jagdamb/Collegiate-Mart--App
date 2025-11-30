import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'

type MessageProps = {
  message: {
    _id?: string
    message?: string
    senderId?: string
    createdAt?: string
  }
}

const Message = ({ message }: MessageProps) => {
  const scrollRef = useRef<View>(null)
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const isMyMessage = message?.senderId === currentUser?._id

  useEffect(() => {
    // Auto-scroll handled by FlatList in Messages component
  }, [message])

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  // Get avatar
  const getAvatar = () => {
    if (isMyMessage) {
      let avatarUrl = ''
      if (currentUser?.avatar) {
        if (Array.isArray(currentUser.avatar)) {
          avatarUrl = currentUser.avatar.join('')
        } else if (typeof currentUser.avatar === 'string') {
          avatarUrl = currentUser.avatar
        }
      }
      return avatarUrl ? { uri: avatarUrl } : require('../../assets/topi.jpeg')
    } else {
      let avatarUrl = ''
      if (selectedUser?.avatar) {
        if (Array.isArray(selectedUser.avatar)) {
          avatarUrl = selectedUser.avatar.join('')
        } else if (typeof selectedUser.avatar === 'string') {
          avatarUrl = selectedUser.avatar
        }
      }
      return avatarUrl ? { uri: avatarUrl } : require('../../assets/topi.jpeg')
    }
  }

  return (
    <View
      ref={scrollRef}
      style={[
        styles.container,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!isMyMessage && <Image source={getAvatar()} style={styles.avatar} />}
      <View
        style={[
          styles.messageContent,
          isMyMessage ? styles.myMessageContent : styles.otherMessageContent,
        ]}
      >
        <Text
          style={[
            styles.time,
            isMyMessage ? styles.myTime : styles.otherTime,
          ]}
        >
          {formatTime(message?.createdAt)}
        </Text>
        <View
          style={[
            styles.bubble,
            isMyMessage ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {message?.message || ''}
          </Text>
        </View>
      </View>
      {isMyMessage && <Image source={getAvatar()} style={styles.avatar} />}
    </View>
  )
}

export default Message

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  messageContent: {
    maxWidth: '75%',
    minWidth: 60,
  },
  myMessageContent: {
    alignItems: 'flex-end',
  },
  otherMessageContent: {
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  myTime: {
    textAlign: 'right',
  },
  otherTime: {
    textAlign: 'left',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 36,
    justifyContent: 'center',
  },
  myBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E5E7EB',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1F2937',
  },
})

