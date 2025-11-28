import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Listing = {
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

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  Product: undefined;
  Drawer: undefined;
  ProductItem: { listing: Listing };
};

export type HomeStackParamList = {
  Home: undefined;
  ProductItem: { listing: Listing };
};

export type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Start'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type ProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Product'>;
export type DrawerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Drawer'>;
export type ProductItemScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductItem'>;

