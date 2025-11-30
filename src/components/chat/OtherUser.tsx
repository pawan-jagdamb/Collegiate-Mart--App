import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { setSelectedUser } from '../../redux/slice/userSlice'

type OtherUserProps = {
  user: Record<string, unknown>
}

const OtherUser = ({ user }: OtherUserProps) => {
  const dispatch = useDispatch()
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser)
  const onlineUsers = useSelector((state: RootState) => state.user.onlineUsers) as string[] | null

  const isOnline = onlineUsers?.includes(user._id as string) || false

  const selectedUserHandler = () => {
    dispatch(setSelectedUser(user))
  }

  const isSelected = selectedUser?._id === user._id

  // Handle avatar URL
  let avatarUrl = ''
  if (user.avatar) {
    if (Array.isArray(user.avatar)) {
      avatarUrl = user.avatar.join('')
    } else if (typeof user.avatar === 'string') {
      avatarUrl = user.avatar
    }
  }

  const avatarSource = avatarUrl
    ? { uri: avatarUrl }
    : require('../../assets/topi.jpeg')

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={selectedUserHandler}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {isOnline && <View style={styles.onlineIndicator} />}
        <Image source={avatarSource} style={styles.avatar} />
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, isSelected && styles.selectedText]}>
          {(user.userName as string) || 'Unknown User'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default OtherUser

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedContainer: {
    backgroundColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
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
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedText: {
    color: '#000000',
  },
})

