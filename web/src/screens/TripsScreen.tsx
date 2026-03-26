import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db, auth } from '../utils/firebase'
import { Trip } from '../types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Calendar, MapPin, Camera, MoreHorizontal } from 'lucide-react'
import styles from './TripsScreen.module.css'

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'planning' | 'ongoing' | 'completed'>('all')

  useEffect(() => {
    async function fetchTrips() {
      if (!auth.currentUser) return
      
      try {
        const tripsRef = collection(db, 'trips')
        const q = query(
          tripsRef,
          where('userId', '==', auth.currentUser.uid),
          orderBy('matchDate', 'desc')
        )
        const snapshot = await getDocs(q)
        
        const fetchedTrips = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          matchDate: doc.data().matchDate?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Trip[]
        
        setTrips(fetchedTrips)
      } catch (error) {
        console.error('Error fetching trips:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(trip => trip.status === filter)

  const statusLabels = {
    all: 'Todos',
    planning: 'Planificando',
    ongoing: 'En curso',
    completed: 'Completados'
  }

  if (loading) {
    return <div className={styles.loading}>Cargando viajes...</div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Mis Viajes</h1>
          <p className={styles.subtitle}>Cada partido es una aventura</p>
        </div>
        <Link to="/viajes/nuevo" className={styles.createBtn}>
          <Plus size={20} />
          Nuevo viaje
        </Link>
      </header>

      {/* Filters */}
      <div className={styles.filters}>
        {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map(status => (
          <button
            key={status}
            className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
            onClick={() => setFilter(status)}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✈️</span>
          <h3>No hay viajes {filter !== 'all' ? statusLabels[filter as keyof typeof statusLabels].toLowerCase() : ''}</h3>
          <p>Crea tu primer viaje a un partido de fútbol.</p>
          <Link to="/viajes/nuevo" className={styles.emptyBtn}>
            Crear viaje
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTrips.map(trip => (
            <article key={trip.id} className={styles.tripCard}>
              <div className={styles.tripImage}>
                {trip.photos?.[0] ? (
                  <img src={trip.photos[0]} alt={trip.destination} />
                ) : (
                  <div className={styles.tripImagePlaceholder}>⚽</div>
                )}
                <span className={`${styles.tripStatus} ${styles[trip.status]}`}>
                  {statusLabels[trip.status]}
                </span>
              </div>
              
              <div className={styles.tripContent}>
                <h3 className={styles.tripDestination}>{trip.destination}</h3>
                
                <div className={styles.tripMeta}>
                  <span className={styles.tripMetaItem}>
                    <Calendar size={14} />
                    {format(trip.matchDate, 'd MMM yyyy', { locale: es })}
                  </span>
                </div>
                
                {trip.description && (
                  <p className={styles.tripDescription}>{trip.description}</p>
                )}
                
                <div className={styles.tripFooter}>
                  {trip.photos && trip.photos.length > 0 && (
                    <span className={styles.tripPhotos}>
                      <Camera size={14} />
                      {trip.photos.length}
                    </span>
                  )}
                  <button className={styles.moreBtn}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
