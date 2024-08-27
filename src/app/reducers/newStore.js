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

      if (get(payload, 'addItems', false)) {
        thunkAPI.dispatch(setAddNewItems(response.data.data));
      } else {
        thunkAPI.dispatch(setListNews(response.data.data));
      }

      return response.data.data;
    } catch (error) {
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
    listSearch: [],
  },
  reducers: {
    setNewCurrentId: (state, action) => {
      state.newCurrentId = action.payload;
    },
    setListNews: (state, action) => {
      state.listNews = action.payload;
    },
    setListNewSearch: (state, action) => {
      state.listSearch = action.payload;
    },
    setNewCurrent: (state, action) => {
      state.newCurrent = action.payload;
    },
    setAddNewItems: (state, action) => {
      state.listNews = [...state.listNews, ...action.payload];
    },
    setAddNewSearchItems: (state, action) => {
      state.listSearch = [...state.listSearch, ...action.payload];
    },
  },
});

export const {
  setNewCurrentId,
  setListNews,
  setNewCurrent,
  setAddNewItems,
  setAddNewSearchItems,
  setListNewSearch
} = newStore.actions;

export default newStore.reducer;
