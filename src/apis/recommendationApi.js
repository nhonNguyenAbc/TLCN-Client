import { API_ROUTE, RESTAURANT_API } from '../configs/ApiConfig';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const recommendationApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: RESTAURANT_API + API_ROUTE.COMMENT,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    // Lấy danh sách bình luận
    getCommentsForVideo: builder.query({
      query: (videoId) => `/${videoId}`,
      providesTags: (result, error, videoId) =>
        result
          ? [...result.comments.map(({ _id }) => ({ type: 'Comment', id: _id })), { type: 'Comment', id: videoId }]
          : [{ type: 'Comment', id: videoId }],
    }),

    // Tạo bình luận mới
    createComment: builder.mutation({
      query: ({ videoId, content }) => ({
        url: `/${videoId}`,
        method: 'POST',
        body: { content }, // Chỉ cần gửi content
      }),
      invalidatesTags: (result, error, { videoId }) => [{ type: 'Comment', id: videoId }],
    }),
  }),
});

// Export hooks
export const { useGetCommentsForVideoQuery, useCreateCommentMutation } = recommendationApi;
