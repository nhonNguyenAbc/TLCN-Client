import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.MENU }),
  tagTypes: ["Menu"],
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: (page) => "/?page=" + page,
      providesTags: ["Menu"],
    }),
    getMenusByUserId: builder.query({
      query: (page) => ({
        url: "/owner?page=" + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Menu"],
    }),
    getMenuById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Menu"],
    }),
    createMenuItem: builder.mutation({
      query: (menuItemData) => ({
        url: "/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: menuItemData,
      }),
      invalidatesTags: ["Menu"],
    }),
    updateMenuItem: builder.mutation({
      query: (formData) => ({
        url: `/menu/${formData.get("id")}`, // Lấy ID từ FormData
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }),
      invalidatesTags: ["Menu"],
    }),
    getMenuByRestaurant: builder.query({
      query: ({ restaurantId, page, size=6, category }) => `/${restaurantId}?page=${page}&size=${size}&category=${category}`, // Đường dẫn API với tham số truyền vào
    }),
    getMenuByRestaurantForStaff: builder.query({
      query: (restaurantId) => `staff/${restaurantId}`, // Đường dẫn API với tham số truyền vào
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `/menu/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Menu"],
    }),
    getMenuItemsByAnyField: builder.query({
      query: (searchTerm) => ({
        url: `/find-menu`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          searchTerm,
        },
      }),
    }),
    getBestSellingMenuItems: builder.query({
      query: () => '/bestseller',
    }),
  }),
});
export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuItemsByAnyFieldQuery,
  useGetMenusByUserIdQuery,
  useGetMenuByRestaurantQuery,
  useGetMenuByRestaurantForStaffQuery,
  useGetBestSellingMenuItemsQuery
} = menuApi;
