import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({
        baseUrl: RESTAURANT_API + API_ROUTE.REVIEW,
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
        getReviewsByRestaurant: builder.query({
            query: ({ restaurant_id, page=1, limit = 5 }) =>
                `/${restaurant_id}?page=${page}&limit=${limit}`,
        }),
        

        // Endpoint: Tạo bình luận mới
        createReview: builder.mutation({
            query: (formData) => ({
                url: '/create',
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
            }),

        }),

        // Endpoint: Cập nhật bình luận
        updateReview: builder.mutation({
            query: ({ id, content }) => ({
                url: `/reviews/update/${id}`,
                method: 'PUT',
                body: { content },
            }),
        }),

        // Endpoint: Xóa bình luận
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/reviews/delete/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Xuất hooks sử dụng trong component
export const {
    useGetReviewsByRestaurantQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;

