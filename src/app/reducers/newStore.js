import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CONSUMER_KEY} from '../../environments';
import {getNewById, getNews} from '../../services/NewsApi';
import {get} from 'lodash';

const token = CONSUMER_KEY;

export const fetchNews = createAsyncThunk(
  'newStore/fetchNews',
  async (payload, thunkAPI) => {
    const {} = thunkAPI.getState();
    try {
      const response = await getNews({
        token,
        filter: payload.filter,
      });

      //   console.log(response);

      if (get(payload, 'addItems', false)) {
        thunkAPI.dispatch(setAddNewItems(response.data.data));
      } else {
        thunkAPI.dispatch(setListNews(response.data.data));
      }

      return response.data.data;
    } catch (error) {
      //   console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const fetchNewById = createAsyncThunk(
  'newStore/fetchNewById',
  async (payload, thunkAPI) => {
    const {} = thunkAPI.getState();

    try {
      const response = await getNewById({
        token,
        id: payload.id,
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const fetchNewsData = createAsyncThunk(
  'newStore/fetchNewsData',
  async (payload, thunkAPI) => {
    const {} = thunkAPI.getState();
    try {
      const response = await getNews({
        token,
        filter: payload.filter,
      });

      return response.data.data;
    } catch (error) {
      //   console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const newStore = createSlice({
  name: 'newStore',
  initialState: {
    newCurrentId: null,
    newCurrent: {},
    listNews: [],
  },
  reducers: {
    setNewCurrentId: (state, action) => {
      state.newCurrentId = action.payload;
    },
    setListNews: (state, action) => {
      state.listNews = action.payload;
    },
    setNewCurrent: (state, action) => {
      state.newCurrent = action.payload;
    },
    setAddNewItems: (state, action) => {
      state.listNews = [...state.listNews, ...action.payload];
    },
  },
});

export const {setNewCurrentId, setListNews, setNewCurrent, setAddNewItems} =
  newStore.actions;

export default newStore.reducer;
