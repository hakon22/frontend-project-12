/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../pages/routes.js';

export const fetchToken = createAsyncThunk(
  'token/fetchToken',
  async (data) => {
    const response = await axios.post(routes.login, data);
    return response.data;
  },
);

const loginAdapter = createEntityAdapter();

const loginSlice = createSlice({
  name: 'login',
  initialState: { loadingStatus: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchToken.fulfilled, (state, { payload }) => {
        const { token, username } = payload;
        state.token = token;
        state.loadingStatus = 'idle';
        state.error = null;
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('username', username);
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectors = loginAdapter.getSelectors((state) => state.login);
export default loginSlice.reducer;
