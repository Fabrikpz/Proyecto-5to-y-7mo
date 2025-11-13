import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// Shared Axios instance for non-hook usage
export const apiClient = axios.create({
  baseURL: '/api',
})

export function useApi() {
  const { token } = useAuth()

  apiClient.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return apiClient
}
