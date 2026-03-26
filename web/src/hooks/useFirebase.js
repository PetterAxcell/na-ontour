import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../utils/firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { user, loading, signOut: () => signOut(auth) }
}

export function usePosts(userId?: string) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, 'posts')
        const q = query(postsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        
        let fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }))
        
        // If userId provided, filter by that user. Otherwise return all
        if (userId) {
          fetchedPosts = fetchedPosts.filter(p => p.userId === userId)
        }
        
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
      setLoading(false)
    }
    fetchPosts()
  }, [userId])

  return { posts, loading }
}

export function useClubs() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClubs() {
      try {
        const clubsRef = collection(db, 'clubs')
        const snapshot = await getDocs(clubsRef)
        setClubs(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      } catch (error) {
        console.error('Error fetching clubs:', error)
      }
      setLoading(false)
    }
    fetchClubs()
  }, [])

  return { clubs, loading }
}

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersRef = collection(db, 'users')
        const snapshot = await getDocs(usersRef)
        setUsers(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      } catch (error) {
        console.error('Error fetching users:', error)
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  return { users, loading }
}

export function useTrips(userId?: string) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrips() {
      try {
        const tripsRef = collection(db, 'trips')
        const q = query(tripsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        
        let fetchedTrips = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }))
        
        if (userId) {
          fetchedTrips = fetchedTrips.filter(t => t.userId === userId)
        }
        
        setTrips(fetchedTrips)
      } catch (error) {
        console.error('Error fetching trips:', error)
      }
      setLoading(false)
    }
    fetchTrips()
  }, [userId])

  return { trips, loading }
}
