import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.ORDER }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (page) => ({
        url: "?page=" + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    getAllOrdersByStaffId: builder.query({
      query: (page) => ({
        url: "/staff?page=" + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    getAllOrdersByUserId: builder.query({
      query: (page) => ({
        url: "/owner?page=" + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: [{ type: "Order", id: "ALL" }],
    }),
    confirmOrder: builder.query({
      query: (id) => ({
        url: `/confirm/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    confirmDirectOrder: builder.mutation({
      query: (id) => ({
        url: `/direct/confirm/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    payOrder: builder.mutation({
      query: (id) => ({
        url: `/pay/${id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, updatedOrder }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedOrder,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Order"],
    }),

    getCheckInOrders: builder.query({
      query: (page) => ({
        url: `/checkin?page=` + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    getCheckOutOrders: builder.query({
      query: (page) => ({
        url: `/checkout?page=` + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    updateCheckInOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/checkin/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Order"],
    }),
    updateCheckOutOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/checkout/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Order"],
    }),
    createDirectOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/direct",
        method: "POST",
        body: newOrder,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    getSuccessfulOrders: builder.query({
      query: (page) => ({
        url: `/checkout?page=` + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    getPendingCashOrders: builder.query({
      query: (page) => ({
        url: `/checkin?page=` + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    totalRevenueOrder: builder.query({
      query: () => ({
        url: `/total-revenue`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    countCompletedOrders: builder.query({
      query: () => ({
        url: `/total-order-complete`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    countOrder: builder.query({
      query: () => ({
        url: `/total-order`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    countOrdersByStatus: builder.query({
      query: () => ({
        url: `/total-order-hold`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    getMostFrequentRestaurantName: builder.query({
      query: () => ({
        url: `/retaurant-name`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    getTotalRevenueOrder5Years: builder.query({
      query: () => ({
        url: `/revenue/five-years`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useConfirmOrderQuery,
  useConfirmDirectOrderMutation,
  usePayOrderMutation,
  useCreateOrderMutation,
  useCreateDirectOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateCheckInOrderMutation,
  useUpdateCheckOutOrderMutation,
  useGetCheckInOrdersQuery,
  useGetCheckOutOrdersQuery,
  useGetSuccessfulOrdersQuery,
  useGetPendingCashOrdersQuery,
  useTotalRevenueOrderQuery,
  useCountCompletedOrdersQuery,
  useCountOrderQuery,
  useCountOrdersByStatusQuery,
  useGetMostFrequentRestaurantNameQuery,
  useGetAllOrdersByUserIdQuery,
  useGetTotalRevenueOrder5YearsQuery,
  useGetAllOrdersByStaffIdQuery,
} = orderApi;
