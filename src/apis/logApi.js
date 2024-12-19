import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const api = axios.create({
  baseURL: RESTAURANT_API + API_ROUTE.LOG,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const getDataOnDate = async (date) => {
  try {
    const response = await api.get("/", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data on date:", error);
    throw error;
  }
};

export const logApi = createApi({
  reducerPath: "logApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.LOG }),
  tagTypes: ["Log"],
  endpoints: (builder) => ({
    getAllLogs: builder.query({
      query: ({ page, size, sort }) => ({
        url: `/?page=${page}` + `&sort=${sort}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Log"],
    }),
  }),
});

export const { useGetAllLogsQuery } = logApi;
