import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, getDocs, orderBy, query, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

// ─────────────────────────────────────────────────────────────
// LoginScreen
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err.code))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">⚽ NA-ONTOUR</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          ¿No tienes cuenta? <Link to="/registro" className="text-blue-400">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// RegisterScreen
// ─────────────────────────────────────────────────────────────
function RegisterScreen({ onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // Create user document in Firestore
      await import('firebase/firestore').then(({ doc, setDoc }) => 
        setDoc(doc(db, 'users', cred.user.uid), {
          name,
          email,
          clubs: [],
          trips: [],
          experiences: [],
          createdAt: serverTimestamp()
        })
      )
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err.code))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg"
            required
            minLength={6}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-400">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────────────────────
function HomeScreen({ user }) {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    loadPosts()
  }, [])

  const handlePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.email,
        content: newPost,
        likes: [],
        createdAt: serverTimestamp()
      })
      setNewPost('')
      // Reload posts
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="bg-gray-800 rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">⚽ NA-ONTOUR</h1>
        <form onSubmit={handlePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué estás pensando?"
            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-3"
            rows="2"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold">
            Publicar
          </button>
        </form>
      </header>

      <h2 className="text-xl font-bold mb-4">📰 Últimas Publicaciones</h2>
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">No hay publicaciones aún. ¡Sé el primero!</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  {post.userName?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">{post.userName}</p>
                  <p className="text-xs text-gray-400">
                    {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Ahora'}
                  </p>
                </div>
              </div>
              <p className="mb-3">{post.content}</p>
              <div className="flex gap-4 text-gray-400 text-sm">
                <span>👍 {post.likes?.length || 0} Me gusta</span>
                <span>💬 0 Comentarios</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TripsScreen
// ─────────────────────────────────────────────────────────────
function TripsScreen({ user }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const q = query(collection(db, 'trips'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        setTrips(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    loadTrips()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">✈️ Mis Viajes</h1>
        <Link to="/viajes/nuevo" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold">
          + Crear Viaje
        </Link>
      </div>
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : trips.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No hay viajes aún. ¡Planifica tu primer viaje!</p>
          <Link to="/viajes/nuevo" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold inline-block">
            Crear mi primer viaje
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg">{trip.destination}</h3>
              <p className="text-gray-400">{trip.clubName}</p>
              <p className="text-sm mt-2">📅 {trip.matchDate}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-700 rounded-full text-sm">
                {trip.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ClubsScreen
// ─────────────────────────────────────────────────────────────
function ClubsScreen() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'clubs'))
        setClubs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    loadClubs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">🏟️ Clubes</h1>
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : clubs.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No hay clubes registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubs.map(club => (
            <div key={club.id} className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg">{club.name}</h3>
              <p className="text-gray-400 text-sm">{club.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ProfileScreen
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">👤 Mi Perfil</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-3xl mb-4">
          {user?.email?.[0]?.toUpperCase() || '?'}
        </div>
        <p className="text-lg mb-2">{user?.email}</p>
        <button 
          onClick={onLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Error helper
// ─────────────────────────────────────────────────────────────
function getErrorMessage(code) {
  const errors = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión',
  }
  return errors[code] || 'Error de autenticación'
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar - solo si está logueado */}
        {user && (
          <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Link to="/" className="font-bold">⚽ NA-ONTOUR</Link>
              <div className="flex gap-4 text-sm">
                <Link to="/" className="hover:text-blue-400">Inicio</Link>
                <Link to="/viajes" className="hover:text-blue-400">Viajes</Link>
                <Link to="/clubes" className="hover:text-blue-400">Clubes</Link>
                <Link to="/perfil" className="hover:text-blue-400">Perfil</Link>
              </div>
            </div>
          </nav>
        )}
        
        <main className="max-w-4xl mx-auto">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <LoginScreen />
            } />
            <Route path="/registro" element={
              user ? <Navigate to="/" /> : <RegisterScreen />
            } />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              user ? <HomeScreen user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/viajes" element={
              user ? <TripsScreen user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/clubes" element={
              user ? <ClubsScreen /> : <Navigate to="/login" />
            } />
            <Route path="/perfil" element={
              user ? <ProfileScreen user={user} onLogout={() => signOut(auth)} /> : <Navigate to="/login" />
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
