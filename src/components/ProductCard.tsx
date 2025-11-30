import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ProductItemScreenNavigationProp } from '../navigation/types';
import { Listing } from '../navigation/types';

type ProductCardProps = {
  name?: string;
  price?: number;
  image?: any;
  listing?: Listing;
  disabled?: boolean;
};

const ProductCard = ({ name = 'Topi', price = 100, image, listing, disabled = false }: ProductCardProps) => {
  const navigation = useNavigation<ProductItemScreenNavigationProp>();

  const handlePress = () => {
    if (listing && !disabled) {
      navigation.navigate('ProductItem', { listing });
    }
  };

  const CardContent = (
    <>
      <Image source={image || require('../assets/topi.jpeg')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.price}>Price: ${price}</Text>
      </View>
    </>
  );

  if (disabled) {
    return (
      <View style={styles.container}>
        {CardContent}
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {CardContent}
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 8,
        marginVertical: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
        resizeMode: 'contain',
        backgroundColor: '#f9fafb',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
        textAlign: 'center',
    },
    price: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    coverImage: {
        width: "90%",
        height: 256,
        borderRadius: 20,
        marginVertical: 10,
        marginLeft: 10,
    },
})