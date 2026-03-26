import { useState, useEffect } from 'react'
import { collection, query, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db, auth } from '../utils/firebase'
import { Club } from '../types'
import { Search, Users, MapPin, Star, Check } from 'lucide-react'
import styles from './ClubsScreen.module.css'

export default function ClubsScreen() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [followedClubs, setFollowedClubs] = useState<string[]>([])

  useEffect(() => {
    async function fetchClubs() {
      try {
        const clubsRef = collection(db, 'clubs')
        const snapshot = await getDocs(clubsRef)
        
        const fetchedClubs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Club[]
        
        setClubs(fetchedClubs)
        
        // Get followed clubs from user
        if (auth.currentUser) {
          // TODO: Fetch from user's clubs array
        }
      } catch (error) {
        console.error('Error fetching clubs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase()) ||
    club.country?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFollow = async (clubId: string) => {
    if (!auth.currentUser) return

    const isFollowing = followedClubs.includes(clubId)
    
    try {
      const clubRef = doc(db, 'clubs', clubId)
      
      if (isFollowing) {
        await updateDoc(clubRef, {
          fans: arrayRemove(auth.currentUser.uid)
        })
        setFollowedClubs(prev => prev.filter(id => id !== clubId))
      } else {
        await updateDoc(clubRef, {
          fans: arrayUnion(auth.currentUser.uid)
        })
        setFollowedClubs(prev => [...prev, clubId])
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Cargando clubes...</div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Clubes</h1>
          <p className={styles.subtitle}>Conecta con tu club y su comunidad</p>
        </div>
      </header>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar clubes por nombre o país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🏟️</span>
          <h3>No se encontraron clubes</h3>
          <p>Prueba con otro término de búsqueda.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredClubs.map(club => {
            const isFollowing = followedClubs.includes(club.id)
            
            return (
              <article key={club.id} className={styles.clubCard}>
                <div className={styles.clubLogo}>
                  {club.logo ? (
                    <img src={club.logo} alt={club.name} />
                  ) : (
                    <span className={styles.clubLogoPlaceholder}>⚽</span>
                  )}
                </div>
                
                <div className={styles.clubContent}>
                  <h3 className={styles.clubName}>{club.name}</h3>
                  
                  <div className={styles.clubMeta}>
                    {club.stadium && (
                      <span className={styles.clubMetaItem}>
                        <MapPin size={14} />
                        {club.stadium}
                      </span>
                    )}
                    {club.country && (
                      <span className={styles.clubMetaItem}>
                        {club.country}
                      </span>
                    )}
                  </div>
                  
                  {club.description && (
                    <p className={styles.clubDescription}>{club.description}</p>
                  )}
                  
                  <div className={styles.clubFooter}>
                    <span className={styles.clubFans}>
                      <Users size={14} />
                      {club.fans?.length || 0} fans
                    </span>
                    
                    <button
                      className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                      onClick={() => toggleFollow(club.id)}
                    >
                      {isFollowing ? (
                        <>
                          <Check size={16} />
                          Siguiendo
                        </>
                      ) : (
                        <>
                          <Star size={16} />
                          Seguir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
