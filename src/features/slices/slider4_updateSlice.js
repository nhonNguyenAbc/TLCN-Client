import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider4_updateSlice = createSlice({
  name: "slider4_update",
  initialState,
  reducers: {
    setSlider4_Update: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider4_Update: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider4_Update: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider4_Update, resetSlider4_Update, deleteSlider4_Update } =
  slider4_updateSlice.actions;

export default slider4_updateSlice.reducer;
