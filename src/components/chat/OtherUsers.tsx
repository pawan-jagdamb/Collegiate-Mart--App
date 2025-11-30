import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import OtherUser from './OtherUser'

const OtherUsers = () => {
  const otherUsers = useSelector((state: RootState) => state.user.otherUsers)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  if (!otherUsers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#9CA3AF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    )
  }

  const filteredUsers = otherUsers.filter(
    (user) => user._id !== currentUser?._id
  )

  if (filteredUsers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No users found</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <OtherUser user={item} />}
        keyExtractor={(item) => (item._id as string) || Math.random().toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default OtherUsers

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#9CA3AF',
    fontSize: 14,
  },
})

