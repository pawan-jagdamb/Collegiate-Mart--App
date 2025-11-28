import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { TouchableOpacity } from 'react-native';
import { ProductItemScreenNavigationProp } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RouteParams = {
  listing: {
    _id: string;
    name: string;
    description?: string;
    regularPrice?: number;
    discountedPrice?: number;
    imageUrls?: string[];
    address?: string;
    offer?: boolean;
    [key: string]: any;
  };
};

const ProductItem = () => {
  const route = useRoute();
  const navigation = useNavigation<ProductItemScreenNavigationProp>();
  const params = route.params as RouteParams;
  const listing = params?.listing;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageScrollRef = useRef<FlatList>(null);

  if (!listing) {
    return (
      <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Product not found</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const price = listing.discountedPrice || listing.regularPrice || 0;
  const hasDiscount = listing.discountedPrice && listing.discountedPrice < listing.regularPrice;
  
  // Get all images or use fallback
  const images = listing.imageUrls && listing.imageUrls.length > 0 
    ? listing.imageUrls 
    : [require('../assets/topi.jpeg')];

  const onImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveImageIndex(index);
  };

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Product Images Gallery */}
          <View style={styles.imageContainer}>
            <FlatList
              ref={imageScrollRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onImageScroll}
              keyExtractor={(item, index) => 
                typeof item === 'string' ? item : `image-${index}`
              }
              renderItem={({ item }) => (
                <View style={styles.imageWrapper}>
                  <Image
                    source={typeof item === 'string' ? { uri: item } : item}
                    style={styles.mainImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
            
            {/* Pagination Indicators */}
            {images.length > 1 && (
              <View style={styles.paginationContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
            
            {/* Image Counter */}
            {images.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {activeImageIndex + 1} / {images.length}
                </Text>
              </View>
            )}
          </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{listing.name || 'Unnamed Product'}</Text>

            {/* Price */}
            <View style={styles.priceContainer}>
              {hasDiscount && listing.regularPrice && (
                <Text style={styles.originalPrice}>${listing.regularPrice}</Text>
              )}
              <Text style={styles.price}>${price}</Text>
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((listing.regularPrice! - listing.discountedPrice!) / listing.regularPrice!) * 100)}% OFF
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            {listing.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{listing.description}</Text>
              </View>
            )}

            {/* Address/Location */}
            {listing.address && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.address}>{listing.address}</Text>
              </View>
            )}

            {/* Offer Badge */}
            {listing.offer && (
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>Special Offer Available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    position: 'relative',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    marginTop: -20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8152f7',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  address: {
    fontSize: 16,
    color: '#6B7280',
  },
  offerBadge: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  offerText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

