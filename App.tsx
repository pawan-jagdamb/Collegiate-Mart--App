import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import "./global.css"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppNavigation from './src/navigation/AppNavigation'
import ToastManager from 'toastify-react-native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store ,persistor} from './src/redux/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { RootState } from './src/redux/store/store'
import { setSocket, resetSocket } from './src/redux/slice/socketSlice'
import { setOnlineUsers } from './src/redux/slice/userSlice'

// Socket.io-client - conditionally import to handle if not installed
// NOTE: socket.io-client has known compatibility issues with React Native
// The '_upgrades' read-only property error is a common issue
// For now, socket.io is disabled to prevent crashes
// TODO: Use react-native-socket.io-client or implement WebSocket directly
const ENABLE_SOCKET_IO = false // Set to true when using React Native compatible socket library

let io: any = null

if (ENABLE_SOCKET_IO) {
  try {
    // Try different import methods for React Native compatibility
    const socketModule = require('socket.io-client')
    io = socketModule.default || socketModule.io || socketModule
    
    if (io) {
      // Wrap io to use polling transport only for React Native
      const originalIo = io
      io = function(url: string, options: any = {}) {
        const rnOptions = {
          ...options,
          transports: ['polling'], // Use only polling for React Native
          forceNew: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        }
        return originalIo(url, rnOptions)
      }
    }
  } catch (error) {
    console.warn('socket.io-client not installed or has compatibility issues.')
    console.warn('Real-time features will be disabled.')
  }
} else {
  console.log('Socket.io is disabled. Real-time chat features will work without live updates.')
  console.log('To enable: Install react-native-socket.io-client and set ENABLE_SOCKET_IO = true')
}

// Socket URL - update this to match your backend socket server
// For production: use your deployed backend URL
// For development: use your local backend URL (e.g., 'http://localhost:5000')
const SOCKET_URL = 'https://collegiate-mart-backend.onrender.com'

const AppContent = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const socket = useSelector((state: RootState) => state.socket.socket) as any

  useEffect(() => {
    // Only set up socket if socket.io-client is available
    if (!io) {
      console.warn('Socket.io-client not available. Skipping socket setup.')
      return
    }

    if (currentUser?._id) {
      console.log('Setting up socket connection for user:', currentUser._id)
      
      let newSocket: any = null
      
      try {
        newSocket = io(SOCKET_URL, {
          query: {
            userId: currentUser._id as string,
          },
          // transports are handled in the io wrapper for RN compatibility
        })

        if (!newSocket) {
          console.warn('Failed to create socket instance')
          return
        }

        dispatch(setSocket(newSocket))

        newSocket.on('connect', () => {
          console.log('Socket connected:', newSocket.id)
        })

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected')
        })

        newSocket.on('getOnlineUsers', (onlineUsers: string[]) => {
          console.log('Online users received:', onlineUsers)
          // Convert string array to the expected format
          const usersArray = onlineUsers.map((id) => ({ _id: id })) as Record<string, unknown>[]
          dispatch(setOnlineUsers(usersArray))
        })

        newSocket.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error)
        })

        return () => {
          console.log('Cleaning up socket connection')
          if (newSocket) {
            try {
              newSocket.removeAllListeners()
              newSocket.close()
            } catch (cleanupError) {
              console.error('Error during socket cleanup:', cleanupError)
            }
          }
          dispatch(resetSocket())
        }
      } catch (error) {
        console.error('Error setting up socket:', error)
        // Disable socket.io if it causes errors
        if (newSocket) {
          try {
            newSocket.close()
          } catch (e) {
            // Ignore cleanup errors
          }
        }
        dispatch(resetSocket())
      }
    } else {
      if (socket) {
        console.log('User logged out, closing socket')
        try {
          socket.close()
        } catch (error) {
          console.error('Error closing socket:', error)
        }
        dispatch(setSocket(null))
        dispatch(setOnlineUsers(null))
      }
    }
  }, [currentUser, dispatch])

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <>
      <AppNavigation/>
      <ToastManager/>
    </>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  )
}

export default App

