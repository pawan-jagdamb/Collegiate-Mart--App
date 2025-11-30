import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { RootState } from '../redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { Colors } from '../theme/themeColors';
import { PencilSquareIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '../redux/store/store';
import { logout } from '../services/operations/authAPI';
import { RootStackParamList } from '../navigation/types';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/slice/userSlice';
import { Toast } from 'toastify-react-native';
// NOTE: For image picking to work, install 'react-native-image-picker' in your project.
// npm install react-native-image-picker
// and follow the library's installation steps for iOS/Android.
import { ImageLibraryOptions, launchImageLibrary, Asset } from 'react-native-image-picker';


const ProfileScreen = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoading = useSelector((state: RootState) => state.user.loading);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Initialize userName from currentUser
  useEffect(() => {
    if (currentUser?.userName) {
      setUserName(currentUser.userName as string);
    }
  }, [currentUser]);
  
  // Join the avatar URL if it has spaces or is an array, and properly encode it
  let avatarUrl = '';
  if (currentUser?.avatar) {
    if (Array.isArray(currentUser.avatar)) {
      avatarUrl = currentUser.avatar.join('');
    } else if (typeof currentUser.avatar === 'string') {
      avatarUrl = currentUser.avatar;
    }
    
    // Convert SVG to PNG for React Native compatibility (Image component doesn't support SVG URLs)
    if (avatarUrl && avatarUrl.includes('/svg')) {
      avatarUrl = avatarUrl.replace('/svg', '/png');
    }
    
    // Properly encode the URL - handle spaces in query parameters
    if (avatarUrl) {
      try {
        // Split URL into base and query string
        const [baseUrl, queryString] = avatarUrl.split('?');
        if (queryString) {
          // Encode query parameters properly
          const params = queryString.split('&').map(param => {
            const [key, ...valueParts] = param.split('=');
            const value = valueParts.join('='); // Handle values that might contain '='
            // Encode the value (spaces become %20)
            return `${key}=${encodeURIComponent(value)}`;
          });
          avatarUrl = `${baseUrl}?${params.join('&')}`;
        } else {
          // No query string, just encode the whole URL
          avatarUrl = encodeURI(avatarUrl);
        }
      } catch (e) {
        // If parsing fails, use encodeURI to encode spaces and special chars
        avatarUrl = encodeURI(avatarUrl);
      }
    }
  }
  
  const remoteAvatarSource = avatarUrl && avatarUrl.trim() !== '' && !imageError
    ? { uri: avatarUrl }
    : { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAACUCAMAAAAeaLPCAAAAQlBMVEX6+vqPj4////+Li4vx8fGioqKIiIiAgICnp6fs7Oz39/eDg4P09PTHx8fLy8vb29u0tLTT09Pl5eWYmJitra2+vr74UUVkAAAD+0lEQVR4nO2c3XKkIBBGtRsQ/ENE3/9VF8dJMpuNoxCFdotzkVQlNyekwQa+sSgymUwmk8lkMplM5j8DHqS28Mc5MzWOehxH1RZ3+gsAWt0NE7e2LK3l09zp+ib+AOPMLQrE8gEKgZbP6gb6Tp3jh/cX7gdyJG8/8uq7+AeVVKnt3gFsFv8M+svwY9eSHX3QXGyrL4iJau2AKXfcnb3VJO2d+5uS+SydkqI99LvD/sSQswdz1B2R2tjDeFB9sbeKln1tD9T7B4KTkofhaNGs9jMhe9A+6guElvuWexTNAsrUyp9A7+nuILPiMOktL4Y6tfUKaK/Z+mRMrf3Eb6l5Dn2X2nql9a94hyVRN2A2tx/vqEisljCFlDyRBxWEqLulnkaPEFQ1bugJyIMKlK8IzFgwTZh8Q2DGHt9BfZcn0CHAHCpPYDsYLC/uLE9i5G9d87debcZA+Yqlly/qwIdUQ8C9gMCatyTkfXffK0S6yrAZS6OfL1hY3RDoyxb8Dw+W44PU1ivHD4hf5XVq7RVQ/lMWJUut/QQ676FHAo3Niv/Qo2xTS3/if1hJZuAX/IZeTJTcgXk1OILIGv/E69iMyMP1C48Vh8L+7xv1fLDskcj58F+0xzazoqNV8E/q7kDdVya15gauOd4pHSGozdUvlkft27yNpJu3cfZFb7f0EbkhnjMDNnPxw8wVyDsKxwXvAVBmKpvXuBaKphwMsbTEBgCtMoNtqqpxuK/Wmde3UP+kVlobo0dVL3PhbgDcNUycyWRIAUXLTqBNsI4C0/Mg+a+RQ6cjd2sARrr+Fk/ANUIy6u0UtMOR3PBRRDnHqx1ge1Fzb/14kbNaBt6hbdPEOvGG7nT3eFfKgTchO2AU9+D7+vc0fYyhB3uFe1nGiG35JOW9wAh3JWAuko+R7IbuKvkIz9nr5CMsljcf+RO7mujyAUl/OvK3Xm28P9xylBjngeoq+Sj3yhe5R0k+QUhCZR8cosj3F7TzZVnF2cj63XYfpYmhvvTEF9QNyjg7qUvqJlLVFEV7/nYEebTjg9Ds8zYi3rkTC8uBboNTvOTT+f1N1AO/4dShxzmiegGn9ggiciYaivPmLJaxT+hhPOucOMWbBECf86BFniLFAqM9oXQET/ORZGDy1y1aNSRL4MC8F216Dyb9rBQoGT5vsZzSJnCgMPzdm5C2ESjTB5+A9fKnaNO+OoW8GQDTU+PT4mMjBk0os8W6sjo2ebGpbE8nPb8AAG3PF7ftbOL6G2lIvgoPoNbzwLl9vPJOvF5yL3PaPq7qCb+E0P0DaqVNPw/DNMlHNEHKaRrmuTejKm6Q2VpzZS1TTDnct7a4Y9bshsqZTCaTyWQymUwms88fqNsyIPDaIpkAAAAASUVORK5CYII=" };
  const avatarSource = localAvatarUri
    ? { uri: localAvatarUri }
    : remoteAvatarSource;

  const handleEditAvatar = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: { assets?: Asset[]; didCancel?: boolean; errorCode?: string | number }) => {
      if (response.didCancel || response.errorCode) {
        return;
      }

      const asset = response.assets && response.assets[0];
      if (asset?.uri) {
        setLocalAvatarUri(asset.uri);
        setImageError(false);
      }
    });
  };

  const handleUpdate = async () => {
    if (!currentUser?._id) {
      Toast.error('User information not available');
      return;
    }

    if (!token) {
      Toast.error('Authentication token not found');
      return;
    }

    try {
      dispatch(updateUserStart());

      // Prepare form data
      const formData: Record<string, unknown> = {};
      
      if (userName.trim()) {
        formData.userName = userName.trim();
      }
      
      if (password.trim()) {
        formData.password = password.trim();
      }
      
      // If local avatar is selected, include it (backend may need to handle upload)
      // For now, sending the URI - you may need to upload to Firebase/server first
      if (localAvatarUri) {
        formData.avatar = localAvatarUri;
      }

      // Check if there's anything to update
      if (Object.keys(formData).length === 0) {
        Toast.error('Please enter at least one field to update');
        dispatch(updateUserFailure('No fields to update'));
        return;
      }

      const response = await apiConnector(
        'POST',
        `${endpoints.UPDATE_USER}/${currentUser._id}`,
        formData,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      const data = response.data as { success: boolean; message?: string; data?: unknown };
      
      if (!data.success) {
        Toast.error(data.message || 'Update failed');
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }

      // Update Redux state with the updated user data
      if (data.data) {
        dispatch(updateUserSuccess(data.data as any));
      }
      
      Toast.success(data.message || 'Profile updated successfully');
      
      // Clear password field after successful update
      setPassword('');
      
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Update failed';
      Toast.error(message);
      dispatch(updateUserFailure(message));
    }
  };

  const handleLogout = () => {
    dispatch(logout((route: string) => {
      (navigation as any).navigate(route as keyof RootStackParamList);
    }));
  };

 
  
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image 
          source={avatarSource} 
          style={styles.profileImage} 
          resizeMode="cover"
          onError={() => setImageError(true)}
        
        />
        <TouchableOpacity
          style={styles.editProfileContainer}
          onPress={handleEditAvatar}
        >
          <Text style={styles.editProfileIcon}>
            <PencilSquareIcon/>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            HII,
          </Text>
          <Text style={styles.greetingEmailText}>
            {(currentUser?.email as string) || 'No email available'}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={(text: string) => setUserName(text)}
            placeholder="Enter username"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            placeholder="Enter new password"
            secureTextEntry
          />
        </View>
        <TouchableOpacity 
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]} 
          onPress={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.updateButtonText}>Updating...</Text>
            </View>
          ) : (
            <Text style={styles.updateButtonText}>Update</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  profileImageContainer: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 50,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  editProfileContainer: {
    height:31,
    width:31,
    backgroundColor: Colors.orange,
    borderRadius: 15,
  position:'absolute',
  bottom: 8,
  right: 15,
  justifyContent: 'center',
  alignItems: 'center',
  },
  editProfileIcon: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 20,
  },
  greetingContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 18,
    color: Colors.disabled,
    marginBottom: 4,
  },
  greetingEmailText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: Colors.text,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: Colors.backgroundPrimary,
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundPrimary,
  },
  readonlyText: {
    fontSize: 14,
    color: Colors.text,
  },
  updateButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})