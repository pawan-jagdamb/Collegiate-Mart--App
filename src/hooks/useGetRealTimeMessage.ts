// NOTE: For real-time messaging to work, install 'socket.io-client' in your project.
// npm install socket.io-client
// You'll also need to set up the socket connection in your app (typically in App.tsx or a socket service)
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../redux/slice/messageSlice'
import { RootState } from '../redux/store/store'
import { Socket } from 'socket.io-client'

const useGetRealTimeMessage = () => {
  const socket = useSelector((state: RootState) => state.socket.socket) as Socket | null
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (newMessage: {
      _id?: string
      message?: string
      senderId?: string
      createdAt?: string
    }) => {
      console.log('New real-time message received:', newMessage)
      dispatch(addMessage(newMessage))
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [socket, dispatch])
}

export default useGetRealTimeMessage

