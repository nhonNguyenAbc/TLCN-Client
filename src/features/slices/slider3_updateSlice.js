import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider3_updateSlice = createSlice({
  name: "slider3_update",
  initialState,
  reducers: {
    setSlider3_Update: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider3_Update: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider3_Update: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider3_Update, resetSlider3_Update, deleteSlider3_Update } =
  slider3_updateSlice.actions;

export default slider3_updateSlice.reducer;
