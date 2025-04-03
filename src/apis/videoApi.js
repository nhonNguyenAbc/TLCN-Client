import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: RESTAURANT_API + API_ROUTE.VIDEO,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // API lấy danh sách video
    getVideos: builder.query({
      query: ({ restaurantName }) => {
        const queryParam = restaurantName ? `?restaurantName=${restaurantName}` : '';
        return `/${queryParam}`;
      },
    }),
    

    // API thêm video
    addVideo: builder.mutation({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
      }),
    }),

    // API lấy danh sách video theo userId
    getVideosByUserId: builder.query({
      query: ({ page = 1, limit = 6 }) => `/user?page=${page}&limit=${limit}`,
    }),
    getMostLikedVideo: builder.query({
      query: ({restaurantId}) => `/most-liked/${restaurantId}`,
    }),
    // API xóa video
    deleteVideo: builder.mutation({
      query: (videoId) => ({
        url: `/delete/${videoId}`, // Endpoint xóa video
        method: 'DELETE',
      }),
    }),

    // API cập nhật video
    updateVideo: builder.mutation({
      query: ({ videoId, updatedData }) => ({
        url: `/update/${videoId}`, // Endpoint cập nhật video
        method: 'PUT',
        body: updatedData,
      }),
    }),
  }),
});

// Xuất hooks sử dụng trong component
export const {
  useGetVideosQuery,
  useAddVideoMutation,
  useGetVideosByUserIdQuery,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
  useGetMostLikedVideoQuery,
} = videoApi;

