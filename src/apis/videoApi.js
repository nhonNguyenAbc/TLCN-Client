import { API_ROUTE, RESTAURANT_API } from '../configs/ApiConfig';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.VIDEO }),
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => '/', // Đường dẫn API để lấy danh sách video
    }),
  }),
});

// Xuất ra hook để sử dụng trong component
export const { useGetVideosQuery } = videoApi;
