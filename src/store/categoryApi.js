import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = 'http://192.168.0.104:5040/api/v1'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Category', 'Genre'],
  endpoints: (builder) => ({
    // Category endpoints
    getCategories: builder.query({
      query: () => '/category',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: '/category',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Genre endpoints
    getGenres: builder.query({
      query: () => '/genres',
      providesTags: ['Genre'],
    }),
    addGenre: builder.mutation({
      query: (genres) => ({
        url: '/genres',
        method: 'POST',
        body: genres,
      }),
      invalidatesTags: ['Genre'],
    }),
    updateGenre: builder.mutation({
      query: ({ id, ...genres }) => ({
        url: `/genres/${id}`,
        method: 'PATCH',
        body: genres,
      }),
      invalidatesTags: ['Genre'],
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/genres/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Genre'],
    }),
  }),
})

export const { 
  useGetCategoriesQuery, 
  useAddCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation,
  useGetGenresQuery,
  useAddGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation
} = categoryApi
