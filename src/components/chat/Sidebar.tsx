import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { setSelectedUser } from '../../redux/slice/userSlice'
import { Toast } from 'toastify-react-native'
import OtherUsers from './OtherUsers'
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid'
import { useGetOtherUsers } from '../../hooks/useGetOtherUsers'

const Sidebar = () => {
  useGetOtherUsers()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const otherUsers = useSelector((state: RootState) => state.user.otherUsers) as Record<string, unknown>[] | null

  const searchSubmitHandler = () => {
    if (!search.trim()) return

    const conversationUser = otherUsers?.find((user) =>
      (user.userName as string)?.toLowerCase().includes(search.toLowerCase())
    )

    if (conversationUser) {
      dispatch(setSelectedUser(conversationUser))
      setSearch('')
    } else {
      Toast.error('User Not found')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          placeholderTextColor="#9CA3AF"
          onSubmitEditing={searchSubmitHandler}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchSubmitHandler}
          activeOpacity={0.7}
        >
          <MagnifyingGlassIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <OtherUsers />
    </View>
  )
}

export default Sidebar

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#4B5563',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#64748B',
    marginVertical: 12,
  },
})

