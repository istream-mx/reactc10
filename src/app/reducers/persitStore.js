import {createSlice} from '@reduxjs/toolkit';

export const persitStore = createSlice({
  name: 'persitStore',
  initialState: {
    statusNotificationPermission: null,
  },
  reducers: {
    setStatusNotificationPermission: (state, action) => {
      state.statusNotificationPermission = action.payload;
    },
  },
});

export const {setStatusNotificationPermission} = persitStore.actions;

export default persitStore.reducer;
