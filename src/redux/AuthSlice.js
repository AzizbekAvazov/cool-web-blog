import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user_fullname: "",
        user_token: "",
        user_id: ""
    },
    reducers: {
        setUserFullnameRdx: (state, action) => {
            state.user_fullname = action.payload
        },
        setUserToken: (state, action) => {
            state.user_token = action.payload
        },
        setUserId: (state, action)=> {
            state.user_id = action.payload
        },
        clearAuthRedux: (state, action) => {
            state.user_fullname = "";
            state.user_token = "";
            state.user_id = "";
        }
    },
})

export const { setUserFullnameRdx, setUserToken, setUserId, clearAuthRedux } = authSlice.actions;

export default authSlice.reducer