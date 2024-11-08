import { API_ROUTE, RESTAURANT_API } from '../configs/ApiConfig';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.COMMENT }),
  endpoints: (builder) => ({
    getCommentsForVideo: builder.query({
      query: (videoId) => `/${videoId}`,
    }),

    createComment: builder.mutation({
      query: ({ videoId, userId, content }) => ({
        url: `videos/${videoId}/comments`,
        method: 'POST',
        body: { userId, content },
      }),
    }),
  }),
});

export const { useGetCommentsForVideoQuery, useCreateCommentMutation } = commentApi;
