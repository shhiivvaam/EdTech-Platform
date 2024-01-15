import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem("token")
        ?
        JSON.parse(localStorage.getItem("token"))
        :
        null,
}

const authSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setToken(state, value) {
            state.user = value.payload;
        }
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;