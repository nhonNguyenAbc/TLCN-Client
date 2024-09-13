import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};
export const avatarSlice = createSlice({
  name: "avatar_url",
  initialState,
  reducers: {
    setAvatar: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteAvatar: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetAvatar: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setAvatar, resetAvatar, deleteAvatar } = avatarSlice.actions;

export default avatarSlice.reducer;
