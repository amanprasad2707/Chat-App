import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: "",
  name: "",
  email: "",
  profileImage: "",
  token: "",
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, name, email, profileImage } = action.payload; // Destructure for clarity
      state._id = _id;
      state.name = name;
      state.email = email;
      state.profileImage = profileImage;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      // Reset user details and socket connection
      state._id = "";
      state.name = "";
      state.email = "";
      state.profileImage = "";
      state.token = "";
      state.socketConnection = null; // Set to null on logout
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

// Export actions
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
