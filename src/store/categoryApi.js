import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = 'http://192.168.0.101:5040/api/v1'

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
      transformResponse: (response) => response?.data || [],
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: '/category',
        method: 'POST',
        body: category,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newCategory } = await queryFulfilled
          dispatch(
            categoryApi.util.updateQueryData('getCategories', undefined, (draft) => {
              draft.push(newCategory?.data || newCategory)
            })
          )
        } catch {}
      },
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: category,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled
          dispatch(
            categoryApi.util.updateQueryData('getCategories', undefined, (draft) => {
              const index = draft.findIndex((c) => c._id === id)
              if (index !== -1) Object.assign(draft[index], updated?.data || updated)
            })
          )
        } catch {}
      },
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            categoryApi.util.updateQueryData('getCategories', undefined, (draft) => {
              const index = draft.findIndex((c) => c._id === id)
              if (index !== -1) draft.splice(index, 1)
            })
          )
        } catch {}
      },
    }),

    // Genre endpoints
    getGenres: builder.query({
      query: () => '/genres',
      transformResponse: (response) => response?.data || [],
      providesTags: ['Genre'],
    }),
    addGenre: builder.mutation({
      query: (genres) => ({
        url: '/genres',
        method: 'POST',
        body: genres,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newGenre } = await queryFulfilled
          dispatch(
            categoryApi.util.updateQueryData('getGenres', undefined, (draft) => {
              draft.push(newGenre?.data || newGenre)
            })
          )
        } catch {}
      },
    }),
    updateGenre: builder.mutation({
      query: ({ id, ...genres }) => ({
        url: `/genres/${id}`,
        method: 'PATCH',
        body: genres,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled
          dispatch(
            categoryApi.util.updateQueryData('getGenres', undefined, (draft) => {
              const index = draft.findIndex((g) => g._id === id)
              if (index !== -1) Object.assign(draft[index], updated?.data || updated)
            })
          )
        } catch {}
      },
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/genres/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            categoryApi.util.updateQueryData('getGenres', undefined, (draft) => {
              const index = draft.findIndex((g) => g._id === id)
              if (index !== -1) draft.splice(index, 1)
            })
          )
        } catch {}
      },
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
