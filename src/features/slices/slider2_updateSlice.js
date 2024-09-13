import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider2_updateSlice = createSlice({
  name: "slider2_update",
  initialState,
  reducers: {
    setSlider2_Update: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider2_Update: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider2_Update: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider2_Update, resetSlider2_Update, deleteSlider2_Update } =
  slider2_updateSlice.actions;

export default slider2_updateSlice.reducer;
