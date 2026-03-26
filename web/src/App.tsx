import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './utils/firebase'

// Screens
import HomeScreen from './screens/HomeScreen'
import TripsScreen from './screens/TripsScreen'
import ExperiencesScreen from './screens/ExperiencesScreen'
import ClubsScreen from './screens/ClubsScreen'
import ProfileScreen from './screens/ProfileScreen'
import LoginScreen from './screens/LoginScreen'
import CreateTripScreen from './screens/CreateTripScreen'
import CreateExperienceScreen from './screens/CreateExperienceScreen'

// Components
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'

// Contexts
import { AuthProvider } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth)

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<HomeScreen />} />
            <Route path="viajes" element={<TripsScreen />} />
            <Route path="viajes/nuevo" element={<CreateTripScreen />} />
            <Route path="experiencias" element={<ExperiencesScreen />} />
            <Route path="experiencias/nueva" element={<CreateExperienceScreen />} />
            <Route path="clubes" element={<ClubsScreen />} />
            <Route path="perfil" element={<ProfileScreen />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
