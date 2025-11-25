import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  Product: undefined;
};

export type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Start'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type ProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Product'>;

