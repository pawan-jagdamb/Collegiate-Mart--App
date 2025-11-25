import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
};

export type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Start'>;

