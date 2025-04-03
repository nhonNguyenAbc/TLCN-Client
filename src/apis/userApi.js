import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

const api = axios.create({
  baseURL: RESTAURANT_API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const loginUser = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
export const adminLogin = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const deleteUserById = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user by id:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async ({ to }) => {
  try {
    const response = await api.post("/mailrs", { to });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (passwordData) => {
  try {
    const response = await api.put("/password", passwordData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API }),
  tagTypes: ["User", "Admin", "Staff"],
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: () => ({
        url: "/user",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: '/change-password',
        method: 'POST',
        body: { oldPassword, newPassword },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }),
    }),
    updateUserById: builder.mutation({
      query: ({ data }) => ({
        url: `/user/update`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"], // Xóa cache của User khi cập nhật thành công
    }),
    login: builder.mutation({
      query: ({ username, email, phone_number, password }) => ({
        url: "/login",
        method: "POST",
        body: { username, email, phone_number, password },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
    adminLogin: builder.mutation({
      query: (userData) => ({
        url: "/loginAd",
        method: "POST",
        body: userData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Admin"],
    }),
    sendMessage: builder.mutation({
      query: ({ message, lat, lng }) => ({
        url: "/chatbot",
        method: "POST",
        body: { message, lat, lng }, // Thêm lat, lng vào body request
      }),
    }),
    
  }),
});

export const { 
  useGetUserByIdQuery, 
  useUpdateUserByIdMutation, 
  useLoginMutation,
  useChangePasswordMutation,
  useLazyGetUserByIdQuery,
  useSendMessageMutation  
} = userApi;
