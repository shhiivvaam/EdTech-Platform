import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../slices/profileSlice';
import profileReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
})

export default rootReducer;