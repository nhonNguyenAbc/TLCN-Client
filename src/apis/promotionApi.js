import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

export const promotionApi = createApi({
  reducerPath: "promotionApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.PROMOTION }),
  tagTypes: ["Promotion"],
  endpoints: (builder) => ({
    getAllPromotion: builder.query({
      query: () => ({
        url: "",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Promotion"],
    }),

    createPromotion: builder.mutation({
      query: (newPromotion) => ({
        url: "/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: newPromotion,
      }),
      invalidatesTags: ["Promotion"],
    }),
    updatePromotion: builder.mutation({
      query: ({ id, updatedPromotionData }) => ({
        url: `/${id}`,
        method: "PUT", // or "PATCH" based on your API's method for updating
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: updatedPromotionData,
      }),
      invalidatesTags: ["Promotion"],
    }),
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Promotion"],
    }),
  }),
});

export const {
  useGetAllPromotionQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionApi;
