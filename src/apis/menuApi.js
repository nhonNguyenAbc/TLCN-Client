import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//import axios from "axios";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

// const api = axios.create({
//   baseURL: "http://localhost:3000/menus",
//   timeout: 10000,
//   headers: { "Content-Type": "application/json" },
// });

// export const createMenuItem = async (menuItemData) => {
//   try {
//     const response = await api.post("/", menuItemData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating menu item:", error);
//     throw error;
//   }
// };

// export const getAllMenuItems = async () => {
//   try {
//     const response = await api.get("/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching menu items:", error);
//     throw error;
//   }
// };

// export const getMenuItemById = async (id) => {
//   try {
//     const response = await api.get(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching menu item:", error);
//     throw error;
//   }
// };

// export const updateMenuItemById = async (id, menuItemData) => {
//   try {
//     const response = await api.put(`/${id}`, menuItemData);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating menu item:", error);
//     throw error;
//   }
// };

// export const deleteMenuItemById = async (id) => {
//   try {
//     const response = await api.delete(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting menu item:", error);
//     throw error;
//   }
// };

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: menuItemData,
      }),
      invalidatesTags: ["Menu"],
    }),
    updateMenuItem: builder.mutation({
      query: ({
        id,
        restaurant_id,
        name,
        code,
        category,
        description,
        unit,
        price,
        discount,
      }) => ({
        url: `/menu/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          restaurant_id,
          name,
          code,
          category,
          description,
          unit,
          price,
          discount,
        },
      }),
      invalidatesTags: ["Menu"],
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
} = menuApi;
