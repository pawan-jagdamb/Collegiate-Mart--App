import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AddProductScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <Text style={styles.subtitle}>Create a new product listing</Text>
    </View>
  )
}

export default AddProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
})

