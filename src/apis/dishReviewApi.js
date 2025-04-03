import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTE, RESTAURANT_API } from "../configs/ApiConfig";

export const dishReviewApi = createApi({
    reducerPath: "dishReviewApi",
    baseQuery: fetchBaseQuery({ baseUrl: RESTAURANT_API + API_ROUTE.DISHREVIEW }),
    tagTypes: ["dishReview"],
    endpoints: (builder) => ({

        getReviewsByDish: builder.query({
            query: (menuItemId) => ({
                url: `/get/${menuItemId}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: ["dishReview"],
        }),

        createReview: builder.mutation({
            query: ({ menuItem, content, image, rating }) => {
                const formData = new FormData();
                formData.append("content", content);
                formData.append("rating", rating);
                if (image) formData.append("image", image);

                return {
                    url: `/create/${menuItem}`,
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                }
               
            },
            
        }),

    }),
});
export const {
    useGetReviewsByDishQuery,
    useCreateReviewMutation,

} = dishReviewApi;
