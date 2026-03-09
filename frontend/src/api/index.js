import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
}

// Jobs
export const jobsApi = {
  list: (params) => api.get('/jobs/', { params }),
  detail: (slug) => api.get(`/jobs/${slug}/`),
  create: (data) => api.post('/jobs/', data),
  update: (slug, data) => api.patch(`/jobs/${slug}/`, data),
  delete: (slug) => api.delete(`/jobs/${slug}/`),
  myJobs: () => api.get('/jobs/my-jobs/'),
  categories: () => api.get('/jobs/categories/'),
  stats: () => api.get('/jobs/stats/'),
  toggleSave: (slug) => api.post(`/jobs/${slug}/save/`),
  savedJobs: () => api.get('/jobs/saved/'),
  jobApplications: (slug) => api.get(`/jobs/${slug}/applications/`),
}

// Applications
export const applicationApi = {
  list: () => api.get('/jobs/applications/all/'),
  create: (data) => api.post('/jobs/applications/all/', data),
  update: (id, data) => api.patch(`/jobs/applications/${id}/`, data),
}
