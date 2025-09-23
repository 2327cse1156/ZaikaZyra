import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: [],
    itemsInMyCity: [],
    cartItems: [],
    totalAmount: 0,
    myOrders:[]
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id == cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      // console.log(state.cartItems);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },
    setMyOrders:(state,action)=>{
      state.myOrders=action.payload
    },
    addMyOrder:(state,action)=>{
      state.myOrders=[action.payload,...state.myOrders]
    },
updateOrderStatus: (state, action) => {
  const { orderId, shopId, status } = action.payload;
  const orderIndex = state.myOrders.findIndex(o => o._id === orderId);
  if (orderIndex !== -1) {
    const order = state.myOrders[orderIndex];
    if (order.shopOrders && order.shopOrders.shop._id === shopId) {
      // Replace shopOrders with a new object
      state.myOrders[orderIndex] = {
        ...order,
        shopOrders: {
          ...order.shopOrders,
          status: status
        }
      };
    }
  }
}


  },
});

export const {
  setUserData,
  setCity,
  setCurrentState,
  setCurrentAddress,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeItem,
  setMyOrders,
  addMyOrder,
  updateOrderStatus
} = userSlice.actions;
export default userSlice.reducer;
