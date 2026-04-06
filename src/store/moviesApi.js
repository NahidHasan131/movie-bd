import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = 'http://192.168.0.101:5040/api/v1'

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
      transformResponse: (response) => {
        return response?.data?.data || []
      },
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newMovie } = await queryFulfilled
          dispatch(
            moviesApi.util.updateQueryData('getMovies', undefined, (draft) => {
              draft.push(newMovie?.data || newMovie)
            })
          )
        } catch {
          console.log()
        }
      },
    }),

    updateMovie: builder.mutation({
      query: ({ id, ...movie }) => ({
        url: `/movies/${id}`,
        method: 'PATCH',
        body: movie,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled
          dispatch(
            moviesApi.util.updateQueryData('getMovies', undefined, (draft) => {
              const index = draft.findIndex((m) => m._id === id)
              if (index !== -1) Object.assign(draft[index], updated?.data || updated)
            })
          )
        } catch {
          console.log()
        }
      },
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            moviesApi.util.updateQueryData('getMovies', undefined, (draft) => {
              const index = draft.findIndex((m) => m._id === id)
              if (index !== -1) draft.splice(index, 1)
            })
          )
        } catch {console.log()}
      },
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
