import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import styles from './LoginScreen.module.css'

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // Update display name
        await updateProfile(userCredential.user, { displayName: name })
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email: userCredential.user.email,
          photoURL: null,
          bio: '',
          homeCity: '',
          homeCountry: '',
          faniqScore: 0,
          badges: [],
          favoriteTeams: [],
          trips: [],
          experiences: [],
          following: [],
          followers: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🌍⚽</span>
          <h1 className={styles.title}>NA-ONTOUR</h1>
          <p className={styles.subtitle}>
            {isLogin ? '¡Bienvenido de vuelta!' : '¡Únete a la comunidad!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              'Cargando...'
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                Iniciar sesión
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <div className={styles.toggle}>
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
