import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import ProductScreen from './ProductScreen'
import { Colors } from '../theme/themeColors'
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid'

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.container}>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon color={Colors.text} size={20} style={styles.searchIcon} />
        <TextInput
          placeholder='Search products'
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          clearButtonMode='while-editing'
          autoCorrect={false}
        />
      </View>
      <ProductScreen searchQuery={searchQuery} />
    </LinearGradient>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    
  },
})