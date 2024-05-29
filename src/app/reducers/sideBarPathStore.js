import {createSlice} from '@reduxjs/toolkit';

export const sideBarPathStore = createSlice({
  name: 'appLoaderStore',
  initialState: {
    sideBarPathCurrent: '',
  },
  reducers: {
    setSideBarCurrent: (state, action) => {
      state.sideBarPathCurrent = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setSideBarCurrent} = sideBarPathStore.actions;

export default sideBarPathStore.reducer;
