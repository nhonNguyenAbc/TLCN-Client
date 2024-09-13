import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};
export const avatar_updateSlice = createSlice({
  name: "avatar_url_update",
  initialState,
  reducers: {
    setAvatar_Update: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteAvatar_Update: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetAvatar_Update: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setAvatar_Update, resetAvatar_Update, deleteAvatar_Update } =
  avatar_updateSlice.actions;

export default avatar_updateSlice.reducer;
