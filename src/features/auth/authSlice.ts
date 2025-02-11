import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type userType = {
  id: string | null;
  email: string | null;
  name: string | null;
  profile_picture_url: string | null;
};

export type AuthState = {
  user: userType | null;
  accessToken: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateUser: (state, action: PayloadAction<userType>) => {
      state.user = action.payload;
    },
    signOutUser: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { updateAccessToken, updateUser, signOutUser } = authSlice.actions;

export default authSlice.reducer;
