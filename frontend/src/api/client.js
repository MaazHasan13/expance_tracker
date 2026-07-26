import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ---------- Expenses ----------
export const fetchExpenses = (params) => api.get('/expenses', { params }).then((r) => r.data)
export const fetchExpense = (id) => api.get(`/expenses/${id}`).then((r) => r.data)
export const createExpense = (data) => api.post('/expenses', data).then((r) => r.data)
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data).then((r) => r.data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)

// ---------- Categories ----------
export const fetchCategories = () => api.get('/categories').then((r) => r.data)
export const createCategory = (data) => api.post('/categories', data).then((r) => r.data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// ---------- Stats ----------
export const fetchSummary = () => api.get('/stats/summary').then((r) => r.data)

export default api
