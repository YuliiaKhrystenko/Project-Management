import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors
api.interceptors.request.use((config) => {
  // console.log(`[API Request]:`, config)
  return config
})

api.interceptors.response.use(
  (response) => {
    // console.log(`[API Response]:`, response)
    return response
  },
  (error) => {
    // console.error(`[API Error]:`, error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default api
