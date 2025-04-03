import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";
export const restaurantApi = createApi({
  reducerPath: "restaurantApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.RESTAURANT }),
  tagTypes: ["Restaurant"],
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => '/provinces',
    }),
    getDistrictsByProvince: builder.query({
      query: (provinceCode) => `/districts/${provinceCode}`,
    }),
    getAllRestaurants: builder.query({
      query: ({ sort = -1, page = 1, size = 8, field = "rating", searchTerm, priceRange = "all", provinceCode="",districtCode='', type='' }) => ({
        url: "",
        params: { sort, page, size, field, searchTerm, priceRange, provinceCode, districtCode,type },
      }),
    }),
    getAllRestaurantPromotion: builder.query({
      query: ({ page = 1, size = 8}) => ({
        url: "/promotions",
        params: { page, size },
      }),
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
      query: (id) => ({
        url: `restaurant/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        providesTags: [{ type: "Restaurant", id: "ALL" }],
      })
    }),
    getRestaurantForUser: builder.query({
      query: () => ({
        url: `suggested-restaurants`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
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
        body: JSON.stringify({
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
        }),        
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
    getNearbyRestaurants: builder.query({
      query: ({ lat, lng }) => `/nearby?lat=${lat}&lng=${lng}`,
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
  useGetAllRestaurantPromotionQuery,
  useGetDistrictsByProvinceQuery,
  useGetProvincesQuery,
  useGetRestaurantForUserQuery,
  useGetNearbyRestaurantsQuery,
} = restaurantApi;
