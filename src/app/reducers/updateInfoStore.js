import {createSlice} from '@reduxjs/toolkit';

export const updateInfoStore = createSlice({
  name: 'updateInfoStore',
  initialState: {
    updateInfo: {},
    hasCheckForUpdate: false,
  },
  reducers: {
    setUpdateInfo: (state, action) => {
      state.updateInfo = action.payload;
    },
    setHasCheckForUpdate: (state, action) => {
      state.hasCheckForUpdate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUpdateInfo, setHasCheckForUpdate} = updateInfoStore.actions;

export default updateInfoStore.reducer;
