import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: () => '/movies',
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
      async onQueryStarted(movie, { dispatch, queryFulfilled }) {
        try {
          const { data: newMovie } = await queryFulfilled
          dispatch(
            moviesApi.util.updateQueryData('getMovies', undefined, (draft) => {
              draft.push(newMovie)
            })
          )
        } catch {
          // error
        }
      },
    }),

    // Update movie
    updateMovie: builder.mutation({
      query: ({ id, ...movie }) => ({
        url: `/movies/${id}`,
        method: 'PUT',
        body: movie,
      }),
      async onQueryStarted({ id, ...movie }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          moviesApi.util.updateQueryData('getMovies', undefined, (draft) => {
            const index = draft.findIndex(m => m.id === id)
            if (index !== -1) {
              draft[index] = { ...draft[index], ...movie }
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo() 
        }
      },
    }),

    // Delete movie
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          moviesApi.util.updateQueryData('getMovies', undefined, (draft) => {
            return draft.filter(movie => movie.id !== id)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo() 
        }
      },
    }),
  }),
})

// Export hooks for usage in components
export const { useGetMoviesQuery, useGetMovieByIdQuery, useAddMovieMutation, useUpdateMovieMutation, useDeleteMovieMutation } = moviesApi
