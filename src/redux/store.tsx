import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice'; 
import vehiclesReducer from './vehiclesSlice'; 

const store = configureStore({
  reducer: {
    products: productsReducer,
    vehicles: vehiclesReducer,
  },
});

export default store;
