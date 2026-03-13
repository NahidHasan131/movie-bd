import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = 'http://192.168.0.106:5040/api/v1'

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
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
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: () => '/movies',
      transformResponse: (response) => response.data,
      providesTags: ['Movies'],
    }),

    getMovieById: builder.query({
      query: (id) => `/movies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Movies', id }],
    }),

    addMovie: builder.mutation({
      query: (movie) => ({
        url: '/movies',
        method: 'POST',
        body: movie,
      }),
      invalidatesTags: ['Movies'],
    }),

    updateMovie: builder.mutation({
      query: ({ id, ...movie }) => ({
        url: `/movies/${id}`,
        method: 'PATCH',
        body: movie,
      }),
      invalidatesTags: ['Movies'],
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movies'],
    }),

    // File upload endpoint
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: '/file-upload-google-drive',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const { 
  useGetMoviesQuery, 
  useGetMovieByIdQuery, 
  useAddMovieMutation, 
  useUpdateMovieMutation, 
  useDeleteMovieMutation,
  useUploadFileMutation
} = moviesApi
