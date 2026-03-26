import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../utils/firebase'
import { User as AppUser } from '../types'

interface AuthContextType {
  currentUser: User | null
  userData: AppUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Listen to user document in Firestore
        const userRef = doc(db, 'users', user.uid)
        
        // Ensure user document exists (for users created before Firestore integration)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || 'Usuario NA-ONTOUR',
            email: user.email,
            photoURL: user.photoURL,
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
        
        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData({ id: doc.id, ...doc.data() } as AppUser)
          }
        })
        setLoading(false)
        return () => unsubscribeSnapshot()
      } else {
        setUserData(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
