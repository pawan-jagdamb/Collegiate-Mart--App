import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConnector } from '../services/apiConnector'
import { endpoints } from '../services/apis'
import { setMessages } from '../redux/slice/messageSlice'
import { RootState } from '../redux/store/store'

const useGetMessages = () => {
  const dispatch = useDispatch()
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages...')
        console.log('Selected User:', selectedUser)

        if (!selectedUser?._id || !currentUser?._id) {
          return
        }

        console.log('Selected UserId:', selectedUser._id)
        const GET_MESSAGE = `${endpoints.BASE_URL}/v1/message/${selectedUser._id}`
        const params = {
          senderId: currentUser._id as string,
          receiverId: selectedUser._id as string,
        }

        const response = await apiConnector<{ success?: boolean; messages?: unknown[] }>(
          'GET',
          GET_MESSAGE,
          null,
          {
            Authorization: `Bearer ${token}`,
          },
          params
        )

        console.log('Fetched Messages:', response)
        
        // Handle both response formats: direct array or { success, messages }
        const data = response.data
        if (Array.isArray(data)) {
          dispatch(setMessages(data))
        } else if (data && typeof data === 'object' && 'messages' in data) {
          dispatch(setMessages((data as { messages: unknown[] }).messages))
        } else if (data && typeof data === 'object') {
          dispatch(setMessages(data as unknown[]))
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [selectedUser, currentUser, token, dispatch])

  return null
}

export default useGetMessages

