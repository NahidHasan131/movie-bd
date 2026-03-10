# Movie-BD RTK Query Setup Guide

## What's Been Done

✅ Created RTK Query API slice with manual cache updates
✅ Configured Redux store with RTK Query
✅ Created movies.json data file
✅ Updated all components to use RTK Query hooks
✅ Added optimistic updates for instant UI feedback

## Installation Steps

### 1. Install Dependencies

```bash
cd movie-bd
npm install
```

This will install:
- `@reduxjs/toolkit` - Redux Toolkit with RTK Query
- `react-redux` - React bindings for Redux
- `json-server` - Mock REST API server

### 2. Start JSON Server (Terminal 1)

```bash
npm run server
```

This starts the mock API server at `http://localhost:3001`

### 3. Start Vite Dev Server (Terminal 2)

```bash
npm run dev
```

This starts the React app at `http://localhost:5173`

## How It Works

### RTK Query Setup

**Store Configuration (`src/store/index.js`):**
- Configured Redux store with RTK Query reducer and middleware
- Automatic caching and refetching enabled

**API Slice (`src/store/moviesApi.js`):**
- `getMovies` - Fetch all movies
- `getMovieById` - Fetch single movie
- `addMovie` - Add new movie with optimistic update
- `updateMovie` - Update movie with optimistic update
- `deleteMovie` - Delete movie with optimistic update

### Manual Cache Updates

All mutations use `onQueryStarted` for optimistic updates:

1. **Optimistic Update**: UI updates instantly
2. **API Call**: Request sent to server
3. **Success**: Changes persist
4. **Error**: Automatic rollback with `patchResult.undo()`

### Component Usage

**AllMovies (Home Page):**
```javascript
const { data: movies, isLoading, isError } = useGetMoviesQuery()
```

**MovieList (Admin):**
```javascript
const { data: movies } = useGetMoviesQuery()
const [deleteMovie] = useDeleteMovieMutation()
```

**UploadMovie (Admin):**
```javascript
const [addMovie, { isLoading }] = useAddMovieMutation()
```

## Features

✨ **Automatic Caching** - Data cached after first fetch
✨ **Loading States** - Built-in loading/error handling
✨ **Optimistic Updates** - Instant UI feedback
✨ **Auto Rollback** - Reverts on API failure
✨ **No Manual State** - RTK Query handles everything

## Testing

1. **View Movies**: Go to home page - movies load from API
2. **Add Movie**: Admin → Upload Movie → Fill form → Submit
3. **Delete Movie**: Admin → Movie List → Click delete icon
4. **Optimistic UI**: Notice instant updates before API responds

## File Structure

```
movie-bd/
├── src/
│   ├── data/
│   │   └── movies.json          # Movie data
│   ├── store/
│   │   ├── index.js             # Redux store config
│   │   └── moviesApi.js         # RTK Query API slice
│   ├── Pages/
│   │   ├── AllMovies.jsx        # Uses useGetMoviesQuery
│   │   ├── MovieList.jsx        # Uses useGetMoviesQuery + useDeleteMovieMutation
│   │   └── UploadMovie.jsx      # Uses useAddMovieMutation
│   └── main.jsx                 # Provider setup
└── package.json
```

## Benefits Over useState

| Feature | useState | RTK Query |
|---------|----------|-----------|
| Caching | ❌ Manual | ✅ Automatic |
| Loading States | ❌ Manual | ✅ Built-in |
| Error Handling | ❌ Manual | ✅ Built-in |
| Optimistic Updates | ❌ Complex | ✅ Simple |
| Data Sync | ❌ Manual | ✅ Automatic |
| Code Amount | 🔴 More | 🟢 Less |

## Next Steps

- Add edit movie functionality
- Add search/filter features
- Connect to real backend API (just change baseUrl)
- Add authentication with RTK Query

## Troubleshooting

**Port 3001 already in use:**
```bash
# Change port in package.json
"server": "json-server --watch src/data/movies.json --port 3002"
# Update baseUrl in moviesApi.js
```

**Movies not loading:**
- Check if json-server is running
- Check browser console for errors
- Verify `http://localhost:3001/movies` returns data

Enjoy your RTK Query powered movie app! 🎬
