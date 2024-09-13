import { configureStore } from "@reduxjs/toolkit";

import avatar_urlReducer from "./features/slices/avatar_urlSlice";
import slider1Reducer from "./features/slices/slider1Slice";
import slider2Reducer from "./features/slices/slider2Slice";
import slider3Reducer from "./features/slices/slider3Slice";
import slider4Reducer from "./features/slices/slider4Slice";
import selectedIdReducer from "./features/slices/selectIdSlice";
import { restaurantApi } from "./apis/restaurantApi";
import { menuApi } from "./apis/menuApi";
import avatar_url_updateReducer from "./features/slices/avatar_url_updateSlice";
import slider1_updateReducer from "./features/slices/slider1_updateSlice";
import slider2_updateReducer from "./features/slices/slider2_updateSlice";
import slider3_updateReducer from "./features/slices/slider3_updateSlice";
import slider4_updateReducer from "./features/slices/slider4_updateSlice";
import { employeeApi } from "./apis/employeeApi";
import { orderApi } from "./apis/orderApi";
import { order } from "./constants/table_head";
import { tableApi } from "./apis/tableApi";
import { userApi } from "./apis/userApi";
import tabReducer from "./features/slices/tabSlice";
import selectedTabReducer from "./features/slices/selectedTabSlice";
import { logApi } from "./apis/logApi";

export const store = configureStore({
  reducer: {
    avatar_url: avatar_urlReducer,
    slider1: slider1Reducer,
    slider2: slider2Reducer,
    slider3: slider3Reducer,
    slider4: slider4Reducer,
    avatar_url_update: avatar_url_updateReducer,
    slider1_update: slider1_updateReducer,
    slider2_update: slider2_updateReducer,
    slider3_update: slider3_updateReducer,
    slider4_update: slider4_updateReducer,
    selectedId: selectedIdReducer,
    tab: tabReducer,
    selectedTab: selectedTabReducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [tableApi.reducerPath]: tableApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [logApi.reducerPath]: logApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(restaurantApi.middleware)
      .concat(menuApi.middleware)
      .concat(employeeApi.middleware)
      .concat(orderApi.middleware)
      .concat(tableApi.middleware)
      .concat(userApi.middleware)
      .concat(logApi.middleware),
});
