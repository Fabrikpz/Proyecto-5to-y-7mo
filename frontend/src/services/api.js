import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// Shared Axios instance for non-hook usage
export const apiClient = axios.create({
  baseURL: '/api',
})

// Hook that returns the shared client and wires the latest JWT token
export function useApi() {
  const { token } = useAuth()

  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }

  return apiClient
}
