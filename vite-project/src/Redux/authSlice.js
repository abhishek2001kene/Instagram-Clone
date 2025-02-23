import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUser:[],
        userProfile:null,
        selectedUser:null
    },
    reducers: {  
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        SetSuggestedUser: (state, action) => {
            state.suggestedUser = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        SetSelectedUser: (state, action)=>{
            state.selectedUser = action.payload;
        }
    }
});



export const { setAuthUser, SetSuggestedUser, setUserProfile, SetSelectedUser } = authSlice.actions;
export default authSlice.reducer; 
