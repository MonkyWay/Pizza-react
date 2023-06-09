import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  totalPrice: 0,
  items: [],
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find(obj => obj.id === action.payload.id)

      if (findItem) {
        findItem.count++
      } else {
        state.items.push({
          ...action.payload,
          count: 1
        })
      }

      state.totalPrice += action.payload.price
    },
    removeItem(state, action) {
      state.items = state.items.filter(obj => obj.id !== action.payload)
    },
    minusItem(state, action) {
      const findItem = state.items.find(obj => obj.id === action.payload)
      if (findItem.count > 1) {
        findItem.count--
      } else {
        state.items = state.items.filter(obj => obj.id !== action.payload)
      }
    },
    clearItems(state) {
      state.items = []
      state.totalPrice = 0
    },
  }
})

export const selectCart = (state) => state.cart
export const selectCartItemById = (id) => (state) => state.cart.items.find(item => item.id === id)

export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions

export default cartSlice.reducer