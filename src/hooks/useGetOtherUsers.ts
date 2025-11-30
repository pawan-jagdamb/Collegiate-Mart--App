import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { apiConnector } from '../services/apiConnector'
import { endpoints } from '../services/apis'
import { setOtherUsers } from '../redux/slice/userSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'

export const useGetOtherUsers = () => {
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (!token) return

      try {
        console.log('Fetching other users...')
        const response = await apiConnector<{ success?: boolean; users?: unknown[] }>(
          'GET',
          `${endpoints.BASE_URL}/v1/user/`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        )

        console.log('Other users response:', response)
        
        // Handle both response formats: direct array or { success, users }
        const data = response.data
        if (Array.isArray(data)) {
          dispatch(setOtherUsers(data as Record<string, unknown>[]))
        } else if (data && typeof data === 'object' && 'users' in data) {
          dispatch(setOtherUsers((data as { users: unknown[] }).users as Record<string, unknown>[]))
        } else if (data && typeof data === 'object') {
          dispatch(setOtherUsers(data as Record<string, unknown>[]))
        }
      } catch (error) {
        console.error('Error fetching other users:', error)
      }
    }

    fetchOtherUsers()
  }, [token, dispatch])
}

