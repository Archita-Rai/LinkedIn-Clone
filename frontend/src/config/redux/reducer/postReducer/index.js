import { getAllComments, getAllPosts } from "../../action/postAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state, action) => {
        state.isLoading = true;
        state.message = "Fetching all the posts..";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.postFetched = true),
          (state.posts = action.payload.posts.reverse());
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(getAllComments.fulfilled,(state,action)=>{
        state.postId = action.payload.postId,
        state.comments = action.payload.comments
      })
  },
});

export const {resetPostId} = postSlice.actions
export default postSlice.reducer;
