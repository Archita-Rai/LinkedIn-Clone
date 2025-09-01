import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests, loginUser, registerUser, updateUser, updateUserProfile } from "../../action/authAction";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isToken: false,
  loggedIn: false,
  message: "",
  profileFetch: false,
  connections: [],
  connectionRequest: [],
  allUsers:[],
  allProfileFetched:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage:(state)=>{
      state.message=""
    },
    setIsToken: (state) =>{
      state.isToken = true;
    },
    setIsTokenNot:(state) =>{
      state.isToken = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true; state.message = "Knoking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.loggedIn = false;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true, state.message = "Registering you";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          // state.loggedIn = true;
          state.message = "Registeration is successful please login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled,(state,action)=>{
         state.isLoading = false,
         state.isError = false,
         state.profileFetch = true,
         state.user = action.payload.userProfile;
      })
      .addCase(getAllUsers.fulfilled,(state,action)=>{
          state.isLoading = false,
          state.isError = false,
          state.allProfileFetched = true
          state.allUsers = action.payload.profiles;
      })
      .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
        state.connections = action.payload
      })
      .addCase(getConnectionsRequest.rejected,(state,action)=>{
        state.message = action.payload
      })
      .addCase(getMyConnectionRequests.fulfilled,(state, action)=>{
        state.connectionRequest = action.payload
      })
      .addCase(getMyConnectionRequests.rejected,(state,action)=>{
        state.message = action.payload
      })
      .addCase(updateUser.rejected,(state,action)=>{
        console.log(action.payload);
        state.message = action.payload.message
      })
      .addCase(updateUserProfile.rejected,(state,action) =>{
        console.log(action.payload);
        state.message = action.payload.message
      })
  },
});

export const {reset,emptyMessage,setIsToken,setIsTokenNot} = authSlice.actions
export default authSlice.reducer;
