import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // token: localStorage.getItem("token")
    //     ?
    //     JSON.parse(localStorage.getItem("token"))
    //     :
    //     null,

    user: null,
}

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        }
    }
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;