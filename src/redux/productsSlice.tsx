import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  pageQuery: 1,
  sortBy: 'name',
  sortOrder: 'ASC'
};

export const productsSlice = createSlice({
  name: 'products',
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

export const { setSearchQuery } = productsSlice.actions;
export const { setPageQuery } = productsSlice.actions;
export const { setSortBy } = productsSlice.actions;
export const { setSortOrder } = productsSlice.actions;

export const selectSearchQuery = (state:any) => state.products.searchQuery;
export const selectPageQuery = (state:any) => state.products.pageQuery;
export const selectSortBy = (state:any) => state.products.sortBy;
export const selectSortOrder = (state:any) => state.products.sortOrder;

export default productsSlice.reducer;