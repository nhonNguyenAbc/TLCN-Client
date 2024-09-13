// import axios from "axios";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

// const api = axios.create({
//   baseURL: "http://localhost:3000/tables",
//   timeout: 10000,
//   headers: { "Content-Type": "application/json" },
// });

// export const getAllTables = async () => {
//   try {
//     const response = await api.get("/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching tables:", error);
//     throw error;
//   }
// };

// export const getTableById = async (id) => {
//   try {
//     const response = await api.get(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching table by id:", error);
//     throw error;
//   }
// };

// export const createTable = async (tableData) => {
//   try {
//     const response = await api.post("/", tableData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating table:", error);
//     throw error;
//   }
// };

// export const updateTableById = async (id, tableData) => {
//   try {
//     const response = await api.put(`/${id}`, tableData);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating table:", error);
//     throw error;
//   }
// };

// export const deleteTableById = async (id) => {
//   try {
//     const response = await api.delete(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting table:", error);
//     throw error;
//   }
// };
export const tableApi = createApi({
  reducerPath: "tableApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.TABLE }),
  tagTypes: ["Table"],
  endpoints: (builder) => ({
    getAllTables: builder.query({
      query: (page) => "/?page=" + page,
      providesTags: ["Table"],
    }),
    getAllTablesOwner: builder.query({
      query: (page) => ({
        url: "owner/?page=" + page,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Table"],
    }),
    getAllTablesUser: builder.query({
      query: ({ upper, lower, sort, page }) =>
        "?upper=" +
        upper +
        "&lower=" +
        lower +
        "&sort=" +
        sort +
        "&page=" +
        page,
      providesTags: ["Table"],
    }),
    getTableById: builder.query({
      query: (id) => `table/${id}`,
      providesTags: ["Table"],
    }),
    createTable: builder.mutation({
      query: (tableData) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: tableData,
      }),
      invalidatesTags: ["Table"],
    }),
    updateTable: builder.mutation({
      query: ({ id, tableData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: tableData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Table"],
    }),
    deleteTable: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Table"],
    }),
    getTableByAnyField: builder.query({
      query: (searchTerm) => ({
        url: "/find-table",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { searchTerm },
      }),
    }),
  }),
});

export const {
  useGetAllTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useGetTableByAnyFieldQuery,
  useGetAllTablesUserQuery,
  useGetAllTablesOwnerQuery,
} = tableApi;
