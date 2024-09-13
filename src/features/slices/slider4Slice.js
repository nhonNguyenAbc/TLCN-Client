import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider4Slice = createSlice({
  name: "slider4",
  initialState,
  reducers: {
    setSlider4: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider4: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider4: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider4, resetSlider4, deleteSlider4 } = slider4Slice.actions;

export default slider4Slice.reducer;
