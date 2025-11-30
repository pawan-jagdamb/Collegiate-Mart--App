import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'
import { apiConnector } from '../services/apiConnector'
import { endpoints } from '../services/apis'
import { Toast } from 'toastify-react-native'
import ProductCard from '../components/ProductCard'
import { Listing } from '../navigation/types'
import { PencilSquareIcon, TrashIcon } from 'react-native-heroicons/solid'

const MyProducts = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const token = useSelector((state: RootState) => state.auth.token)
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShowListings = async () => {
    if (!currentUser?._id) {
      Toast.error('User information not available')
      return
    }

    if (!token) {
      Toast.error('Authentication token not found')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Fetching listings for user:', currentUser._id)

      const response = await apiConnector<{ success: boolean; message?: string; listings?: Listing[] }>(
        'GET',
        `${endpoints.SHOW_LISTING}/${currentUser._id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      console.log('Response:', response)

      const data = response.data as { success: boolean; message?: string; listings?: Listing[] }

      if (!data.success) {
        const errorMessage = data.message || 'Failed to fetch listings'
        console.error('API Error:', errorMessage)
        setError(errorMessage)
        Toast.error(errorMessage)
        setLoading(false)
        return
      }

      console.log('Listings data:', data.listings)
      setUserListings(data.listings || [])
      
      if (data.listings && data.listings.length === 0) {
        Toast.info('No listings found')
      } else {
        Toast.success('Listings loaded successfully')
      }
    } catch (error: any) {
      console.error('Error fetching listings:', error.message)
      const errorMessage = error?.response?.data?.message || 'Something went wrong!'
      setError(errorMessage)
      Toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleShowListings()
  }, [])

  const handleEdit = (listing: Listing) => {
    // TODO: Navigate to edit screen or open edit modal
    console.log('Edit listing:', listing._id)
    Toast.info('Edit functionality coming soon')
  }

  const handleDelete = async (listingId: string) => {
    if (!listingId) {
      Toast.error('Listing ID not found')
      return
    }

    const authToken = (currentUser as any)?.token || token
    if (!authToken) {
      Toast.error('Authentication token not found')
      return
    }

    try {
      const response = await apiConnector<{ success: boolean; message?: string }>(
        'DELETE',
        `${endpoints.DELETE_LISTING}/${listingId}`,
        null,
        {
          Authorization: `Bearer ${authToken}`,
        }
      )

      const data = response.data as { success: boolean; message?: string }

      if (!data.success) {
        Toast.error('Error in deleting listing')
        return
      }

      Toast.success('Listing deleted Successfully')
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error: any) {
      Toast.error('Error in deleting listings')
      console.log(error)
    }
  }

  const renderProductCard = ({ item }: { item: Listing }) => {
    const price = item.discountedPrice || item.regularPrice || 0
    const image = item.imageUrls && item.imageUrls.length > 0 
      ? { uri: item.imageUrls[0] } 
      : require('../assets/topi.jpeg')
    
    return (
      <View style={styles.cardWrapper}>
        <ProductCard 
          name={item.name || 'Unnamed Product'}
          price={price}
          image={image}
          listing={item}
          disabled={true}
        />
        <View style={styles.iconContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEdit(item)}
            activeOpacity={0.7}
          >
            <PencilSquareIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => item._id && handleDelete(item._id)}
            activeOpacity={0.7}
          >
            <TrashIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8152f7" />
        <Text style={styles.loadingText}>Fetching your listings...</Text>
      </View>
    )
  }

  if (error && userListings.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleShowListings}>
          Tap to retry
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Products</Text>
      {userListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No listings found</Text>
          <Text style={styles.emptySubtext}>Create your first product listing!</Text>
        </View>
      ) : (
        <FlatList
          data={userListings}
          renderItem={renderProductCard}
          keyExtractor={(item) => item._id || Math.random().toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          refreshing={loading}
          onRefresh={handleShowListings}
        />
      )}
    </View>
  )
}

export default MyProducts

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#8152f7',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})