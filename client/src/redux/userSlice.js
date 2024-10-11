import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: "",
  name: "",
  email: "",
  profileImage: "",
  token: "",
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id
      state.name = action.payload.name
      state.email = action.payload.email
      state.profileImage = action.payload.profileImage
    },
    setToken: (state, action) => {
      state.token = action.payload.token
    },
    logout: (state, action) => {
      state._id = ""
      state.name = ""
      state.email = ""
      state.profileImage = ""
      state.token = ""
    }
  },
});


export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer

