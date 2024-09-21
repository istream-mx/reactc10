import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CONSUMER_KEY} from '../../environments';
import {createTokenNotification} from '../../services/NotificationApi';
import {get} from 'lodash';

const token = CONSUMER_KEY;

export const registerTokenNotificationDevice = createAsyncThunk(
  'pushNotificationStore/registerTokenNotificationDevice',
  async (payload, thunkAPI) => {
    const {} = thunkAPI.getState();
    try {
      const response = await createTokenNotification({
        token,
        tokenNotification: payload.tokenNotification,
        typeDevice: payload.typeDevice,
      });

      return response.data.data;
    } catch (error) {
      //   console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const pushNotificationStore = createSlice({
  name: 'pushNotificationStore',
  initialState: {
    isNotificationMode: false,
  },
  reducers: {
    setIsNotificationMode: (state, action) => {
      state.isNotificationMode = action.payload;
    },
  },
});

export const {setIsNotificationMode} = pushNotificationStore.actions;

export default pushNotificationStore.reducer;
