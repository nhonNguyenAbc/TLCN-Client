import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider1_updateSlice = createSlice({
  name: "slider1_update",
  initialState,
  reducers: {
    setSlider1_Update: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider1_Update: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider1_Update: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider1_Update, resetSlider1_Update, deleteSlider1_Update } =
  slider1_updateSlice.actions;

export default slider1_updateSlice.reducer;
