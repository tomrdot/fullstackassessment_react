import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  pageQuery: 1,
  sortBy: 'dvid',
  sortOrder: 'ASC'
};

export const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setSearchQuery: (state:any, action:any) => {
      state.searchQuery = action.payload;
    },
    setPageQuery: (state:any, action:any) => {
      state.pageQuery = action.payload;
    },
    setSortBy: (state:any, action:any) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state:any, action:any) => {
      state.sortOrder = action.payload;
    },
  },
});

export const { setSearchQuery } = vehiclesSlice.actions;
export const { setPageQuery } = vehiclesSlice.actions;
export const { setSortBy } = vehiclesSlice.actions;
export const { setSortOrder } = vehiclesSlice.actions;

export const selectSearchQuery = (state:any) => state.vehicles.searchQuery;
export const selectPageQuery = (state:any) => state.vehicles.pageQuery;
export const selectSortBy = (state:any) => state.vehicles.sortBy;
export const selectSortOrder = (state:any) => state.vehicles.sortOrder;

export default vehiclesSlice.reducer;