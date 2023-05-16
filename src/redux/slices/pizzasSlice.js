import axios from 'axios'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchPizzas = createAsyncThunk(
  'pizzas/fetchPizzasStatus',
  async (params) => {
    const { sortBy, order, category, search, currentPage } = params
    const url = `https://64490aa9b88a78a8f0fb660a.mockapi.io/pizzas/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`

    const { data } = await axios.get(url)
    return data
  }
)

const initialState = {
  items: [],
  status: 'loading' // pending | success | error
}

const pizzasSlice = createSlice({
  name: 'pizzas',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload
    },
  },
  extraReducers: {
    [fetchPizzas.pending]: (state) => {
      state.status = 'pending'
      state.items = []
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      state.items = action.payload
      state.status = 'success'
    },
    [fetchPizzas.rejected]: (state) => {
      state.status = 'error'
      state.items = []
    },
  }
})

export const { setItems } = pizzasSlice.actions

export default pizzasSlice.reducer