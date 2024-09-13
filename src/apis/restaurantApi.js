import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";
export const restaurantApi = createApi({
  reducerPath: "restaurantApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.RESTAURANT }),
  tagTypes: ["Restaurant"],
  endpoints: (builder) => ({
    getAllRestaurants: builder.query({
      query: ({ page, sort, upper, lower }) =>
        "?page=" +
        page +
        "&sort=" +
        sort +
        "&upper=" +
        upper +
        "&lower=" +
        lower,
      providesTags: ["Restaurant"],
    }),
    getAllRestaurantByUserId: builder.query({
      query: (page) => ({
        url: `own/?page=${page}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Restaurant"],
    }),
    getAllRestaurantsByUserId: builder.query({
      query: () => ({
        url: `/owner`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Restaurant"],
    }),
    getRestaurantById: builder.query({
      query: (id) => `restaurant/${id}`,
      providesTags: [{ type: "Restaurant", id: "ALL" }],
    }),
    createRestaurant: builder.mutation({
      query: ({
        name,
        address,
        openTime,
        closeTime,
        description,
        price_per_table,
        image_url,
        slider1,
        slider2,
        slider3,
        slider4,
        public_id_avatar,
        public_id_slider1,
        public_id_slider2,
        public_id_slider3,
        public_id_slider4,
      }) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          name,
          address,
          openTime,
          closeTime,
          description,
          price_per_table,
          image_url,
          slider1,
          slider2,
          slider3,
          slider4,
          public_id_avatar,
          public_id_slider1,
          public_id_slider2,
          public_id_slider3,
          public_id_slider4,
        },
      }),
      invalidatesTags: ["Restaurant"],
    }),
    updateRestaurant: builder.mutation({
      query: ({ id, restaurantData }) => ({
        url: `/restaurant/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: restaurantData,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    deleteRestaurant: builder.mutation({
      query: (id) => ({
        url: `/restaurant/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Restaurant"],
    }),
  }),
});
export const {
  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetAllRestaurantsByUserIdQuery,
  useGetAllRestaurantByUserIdQuery,
} = restaurantApi;
