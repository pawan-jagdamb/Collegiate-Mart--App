import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { RootState } from '../redux/store/store';
import { useSelector } from 'react-redux';
import { Colors } from '../theme/themeColors';
import { PencilSquareIcon } from 'react-native-heroicons/solid';


const ProfileScreen = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [imageError, setImageError] = useState(false);
  // const userName = currentUser?.userName as string;
  console.log(currentUser?.avatar)
  console.log(currentUser);
  
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
  
  const avatarSource = avatarUrl && avatarUrl.trim() !== '' && !imageError
    ? { uri: avatarUrl }
    : { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAACUCAMAAAAeaLPCAAAAQlBMVEX6+vqPj4////+Li4vx8fGioqKIiIiAgICnp6fs7Oz39/eDg4P09PTHx8fLy8vb29u0tLTT09Pl5eWYmJitra2+vr74UUVkAAAD+0lEQVR4nO2c3XKkIBBGtRsQ/ENE3/9VF8dJMpuNoxCFdotzkVQlNyekwQa+sSgymUwmk8lkMplM5j8DHqS28Mc5MzWOehxH1RZ3+gsAWt0NE7e2LK3l09zp+ib+AOPMLQrE8gEKgZbP6gb6Tp3jh/cX7gdyJG8/8uq7+AeVVKnt3gFsFv8M+svwY9eSHX3QXGyrL4iJau2AKXfcnb3VJO2d+5uS+SydkqI99LvD/sSQswdz1B2R2tjDeFB9sbeKln1tD9T7B4KTkofhaNGs9jMhe9A+6guElvuWexTNAsrUyp9A7+nuILPiMOktL4Y6tfUKaK/Z+mRMrf3Eb6l5Dn2X2nql9a94hyVRN2A2tx/vqEisljCFlDyRBxWEqLulnkaPEFQ1bugJyIMKlK8IzFgwTZh8Q2DGHt9BfZcn0CHAHCpPYDsYLC/uLE9i5G9d87debcZA+Yqlly/qwIdUQ8C9gMCatyTkfXffK0S6yrAZS6OfL1hY3RDoyxb8Dw+W44PU1ivHD4hf5XVq7RVQ/lMWJUut/QQ676FHAo3Niv/Qo2xTS3/if1hJZuAX/IZeTJTcgXk1OILIGv/E69iMyMP1C48Vh8L+7xv1fLDskcj58F+0xzazoqNV8E/q7kDdVya15gauOd4pHSGozdUvlkft27yNpJu3cfZFb7f0EbkhnjMDNnPxw8wVyDsKxwXvAVBmKpvXuBaKphwMsbTEBgCtMoNtqqpxuK/Wmde3UP+kVlobo0dVL3PhbgDcNUycyWRIAUXLTqBNsI4C0/Mg+a+RQ6cjd2sARrr+Fk/ANUIy6u0UtMOR3PBRRDnHqx1ge1Fzb/14kbNaBt6hbdPEOvGG7nT3eFfKgTchO2AU9+D7+vc0fYyhB3uFe1nGiG35JOW9wAh3JWAuko+R7IbuKvkIz9nr5CMsljcf+RO7mujyAUl/OvK3Xm28P9xylBjngeoq+Sj3yhe5R0k+QUhCZR8cosj3F7TzZVnF2cj63XYfpYmhvvTEF9QNyjg7qUvqJlLVFEV7/nYEebTjg9Ds8zYi3rkTC8uBboNTvOTT+f1N1AO/4dShxzmiegGn9ggiciYaivPmLJaxT+hhPOucOMWbBECf86BFniLFAqM9oXQET/ORZGDy1y1aNSRL4MC8F216Dyb9rBQoGT5vsZzSJnCgMPzdm5C2ESjTB5+A9fKnaNO+OoW8GQDTU+PT4mMjBk0os8W6sjo2ebGpbE8nPb8AAG3PF7ftbOL6G2lIvgoPoNbzwLl9vPJOvF5yL3PaPq7qCb+E0P0DaqVNPw/DNMlHNEHKaRrmuTejKm6Q2VpzZS1TTDnct7a4Y9bshsqZTCaTyWQymUwms88fqNsyIPDaIpkAAAAASUVORK5CYII=" };

 
  
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image 
          source={avatarSource} 
          style={styles.profileImage} 
          resizeMode="cover"
        
        />
        <TouchableOpacity
        style={styles.editProfileContainer}
        >
          <Text style={styles.editProfileContainer}>
            <PencilSquareIcon/>
          </Text>
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
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileContainer: {
    height:31,
    width:31,
    backgroundColor: Colors.orange,
    borderRadius: 15,
  }
})