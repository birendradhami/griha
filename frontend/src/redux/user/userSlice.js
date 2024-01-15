import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  signinError: null,
  error: null,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loddingStart: (state) => {
      state.loading = true;
    },
    loadingStop: (state) => {
      state.loading = false;
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.signinError = false;
    },
    signinFailed: (state, action) => {
      state.signinError = action.payload;
      state.loading = false;
    },
    userUpdateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    
    userUpdateFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // handle users

    getUsersSuccess:(state,action) =>{  
      
      state.error = false;
      state.users = action.payload;
      state.loading = false;
    },

    //=====Handlle User Delete State =====//

    userDeleteSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = false;
    },
    userDeleteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Handle Sign Out
    signoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = false;
    },
    signoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // HANDLE lISTINS SAVED ITEMS
    handleSave: (state, action) => {
      state.savedListing.push(action.payload);
    },
    handleLisingRemove: (state, action) => {
      state.savedListing = action.payload;
    },
  },
});

export const {
  loddingStart,
  loadingStop,
  signinSuccess,
  signinFailed,
  userUpdateFailed,
  userUpdateSuccess,
  userDeleteStart,
  userDeleteSuccess,
  userDeleteFail,
  signoutSuccess,
  signoutFailed,
  handleSave,
  handleLisingRemove,
  getUsersSuccess,
} = userSlice.actions;

export default userSlice.reducer;
