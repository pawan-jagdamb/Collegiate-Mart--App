import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ProductCard from '../components/ProductCard';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import { Toast } from 'toastify-react-native';
import * as Keychain from 'react-native-keychain';

type ProductScreenProps = {
  searchQuery?: string;
};

type Listing = {
  _id: string;
  name: string;
  description?: string;
  regularPrice?: number;
  discountedPrice?: number;
  imageUrls?: string[];
  [key: string]: any;
};

const ProductScreen = ({ searchQuery = '' }: ProductScreenProps) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => state.auth.token);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = useCallback(async () => {
    console.log('Fetching listings');
    console.log('Search query:');
    console.log('Token:', token);
    console.log('Current user:', currentUser);
    setLoading(true);
    try {
      // Build query parameters according to backend API
      const params: string[] = [];
      
      if (searchQuery.trim()) {
        params.push(`searchTerm=${encodeURIComponent(searchQuery.trim())}`);
      }
      
      // Optional: Add other filters if needed
      // params.push('limit=9');
      // params.push('startIndex=0');
      // params.push('sort=createdAt');
      // params.push('order=desc');

      // Use GET_LISTING endpoint (which is /listing)
      const url = params.length > 0
        ? `${endpoints.GET_LISTING}?${params.join('&')}`
        : endpoints.GET_LISTING;

      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Get token from keychain if not in redux
      let authToken = token;
      if (!authToken) {
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            authToken = credentials.password;
          }
        } catch (keychainError) {
          console.log('Keychain error:', keychainError);
        }
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      console.log('Fetching listings from:', url);
      console.log('Headers:', headers);
      
      const response = await apiConnector('GET', url, undefined, headers);
      console.log('API Response:', response.data);
      
      // Backend returns: { success: true, listings: [...] }
      const data = response.data as { success?: boolean; listings?: Listing[] };
      
      if (data.success && data.listings && Array.isArray(data.listings)) {
        console.log(`Fetched ${data.listings.length} listings`);
        setListings(data.listings);
      } else {
        console.log('Unexpected response structure:', data);
        setListings([]);
      }
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      
      // Handle different types of errors
      let errorMessage = 'Failed to fetch listings';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Check if backend is running on localhost:5000';
      } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Toast.error(errorMessage);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, token]);

  useEffect(() => {
    // On initial load (empty searchQuery), fetch immediately
    if (searchQuery === '') {
      fetchListings();
      return;
    }

    // When user is typing, debounce the API call (wait 500ms after they stop typing)
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchListings]);

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.gradient}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8152f7" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={({ item }) => {
            const price = item.discountedPrice || item.regularPrice || 0;
            const image = item.imageUrls && item.imageUrls.length > 0 
              ? { uri: item.imageUrls[0] } 
              : require('../assets/topi.jpeg');
            
            return (
              <ProductCard 
                name={item.name || 'Unnamed Product'}
                price={price}
                image={image}
                listing={item}
              />
            );
          }}
          keyExtractor={(item) => item._id || Math.random().toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
        />
      )}
    </LinearGradient>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

