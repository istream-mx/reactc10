import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CONSUMER_KEY} from '../../environments';
import {
  getLiveStreamUrl,
  getScheduleEventList,
} from '../../services/LiveStreamsApi';

const token = CONSUMER_KEY;

export const fetchLiveStream = createAsyncThunk(
  'liveStreamStore/fetchLiveStream',
  async (_payload, thunkAPI) => {
    const {} = thunkAPI.getState();

    try {
      const response = await getLiveStreamUrl({
        token,
      });
      thunkAPI.dispatch(setLiveStreams(response.data.data));

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const fetchScheduleEvents = createAsyncThunk(
  'liveStreamStore/fetchScheduleEvents',
  async (_payload, thunkAPI) => {
    const {} = thunkAPI.getState();

    try {
      const response = await getScheduleEventList({
        token,
      });
      thunkAPI.dispatch(setScheduleEvents(response.data.data));
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const liveStreamStore = createSlice({
  name: 'liveStreamStore',
  initialState: {
    liveStreamCurrent: {},
    liveStreams: [],
    scheduleEvents: [],
  },
  reducers: {
    setLiveStreamCurrent: (state, action) => {
      state.liveStreamCurrent = action.payload;
    },
    setLiveStreams: (state, action) => {
      state.liveStreams = action.payload;
    },
    setScheduleEvents: (state, action) => {
      state.scheduleEvents = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLiveStreamCurrent, setLiveStreams, setScheduleEvents} =
  liveStreamStore.actions;

export default liveStreamStore.reducer;
