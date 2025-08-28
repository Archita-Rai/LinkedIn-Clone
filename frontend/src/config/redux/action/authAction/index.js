import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { connection } from "next/server";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      console.log(user);
      const response = await clientServer.post("/users/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token && response.data.userId) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
      } else {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      return thunkAPI.fulfillWithValue({
        token: response.data.token,
        userId: response.data.userId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/users/register", {
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
      });

      // return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      console.log(user);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        return thunkAPI.rejectWithValue("User ID not found");
      }

      const response = await clientServer.get(`/users/${userId}/profile`, {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "/user/getAllUser",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/connections", {
        token: user.token,
        connectionId: user.userId,
      });
        thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionsRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/connections/sent", {
        params: {
          token: user.token,
        },
      });

      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/connections/received", {
        params: {
          token: user.token,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const { connectionId } = user;

      const response = await clientServer.patch(
        `/connections/${connectionId}`,
        {
          token: user.token,
          action_type: user.action,
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
