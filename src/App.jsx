import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import AllMovies from './Pages/AllMovies'
import UploadMovie from './Pages/UploadMovie'
import MovieList from './Pages/MovieList'
import Categories from './Pages/Categories'
import Genres from './Pages/Genres'
import AppLayout from './Component/HomeLayout/AppLayout'
import AdminAppLayout from './Component/Adminlayout/AdminAppLayout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <AllMovies />
        }
      ]
    },
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'signup',
          element: <Signup />
        }
      ]
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminAppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'upload-movie',
          element: <UploadMovie />
        },
        {
          path: 'movie-list',
          element: <MovieList />
        },
        {
          path: 'authors',
          element: <div className="alert alert-info">Authors page coming soon...</div>
        },
        {
          path: 'categories',
          element: <Categories />
        },
        {
          path: 'genres',
          element: <Genres />
        },
        {
          path: 'settings',
          element: <div className="alert alert-info">Settings page coming soon...</div>
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
