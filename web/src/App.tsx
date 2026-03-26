import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import TripsScreen from './screens/TripsScreen'
import ExperiencesScreen from './screens/ExperiencesScreen'
import ClubsScreen from './screens/ClubsScreen'
import ProfileScreen from './screens/ProfileScreen'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">⚽ NA-ONTOUR</h1>
            {user && (
              <button
                onClick={() => window.signOut?.()}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
            <Route path="/viajes" element={user ? <TripsScreen /> : <Navigate to="/login" />} />
            <Route path="/experiencias" element={user ? <ExperiencesScreen /> : <Navigate to="/login" />} />
            <Route path="/clubes" element={user ? <ClubsScreen /> : <Navigate to="/login" />} />
            <Route path="/perfil" element={user ? <ProfileScreen /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
            <Route path="/registro" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
