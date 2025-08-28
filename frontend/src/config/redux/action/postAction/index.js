import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BLOCKED_PAGES } from "next/dist/shared/lib/constants";
import { comment } from "postcss";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
     
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("Post uploaded");
      } else {
        return thunkAPI.rejectWithValue("Post is not uploaded");
      }
    } catch {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.delete(`/posts/${postId}`, {
        data: {
          token: localStorage.getItem("token"),
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const incrementPostLikes = createAsyncThunk(
  "post/incrementPostLikes",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.patch(`/posts/${postId}/like`,{
     
          token: localStorage.getItem("token"),
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/posts/${postId}/comments`);
      return thunkAPI.fulfillWithValue({
        comments: response.data,
        postId: postId,
      });

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const postId = commentData.postId;
      console.log({ postId: commentData.postId, body: commentData.body });

      const response = await clientServer.post(`posts/${postId}/comments`, {
        token: localStorage.getItem("token"),
        commentBody: commentData.body,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (commentData, thunkAPI) => {
    try {
      console.log(commentData._id);
      const { _id, postId } = commentData;
      const id = _id;
      const response = await clientServer.delete(
        `/posts/${postId}/comments/${id}`,
        {
          data: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
