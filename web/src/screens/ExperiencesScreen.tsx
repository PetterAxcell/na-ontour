import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db, auth } from '../utils/firebase'
import { Experience, ExperienceType } from '../types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Camera, Calendar, Tag, MoreHorizontal, Grid, List } from 'lucide-react'
import styles from './ExperiencesScreen.module.css'

const typeLabels: Record<ExperienceType, string> = {
  match: 'Partido',
  travel: 'Viaje',
  event: 'Evento',
  personal: 'Personal'
}

const typeEmojis: Record<ExperienceType, string> = {
  match: '⚽',
  travel: '✈️',
  event: '🎉',
  personal: '💭'
}

export default function ExperiencesScreen() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<ExperienceType | 'all'>('all')

  useEffect(() => {
    async function fetchExperiences() {
      if (!auth.currentUser) return
      
      try {
        const expRef = collection(db, 'experiences')
        const q = query(
          expRef,
          where('userId', '==', auth.currentUser.uid),
          orderBy('date', 'desc')
        )
        const snapshot = await getDocs(q)
        
        const fetchedExp = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Experience[]
        
        setExperiences(fetchedExp)
      } catch (error) {
        console.error('Error fetching experiences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  const filteredExp = filter === 'all'
    ? experiences
    : experiences.filter(exp => exp.type === filter)

  if (loading) {
    return <div className={styles.loading}>Cargando experiencias...</div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Experiencias</h1>
          <p className={styles.subtitle}>Tus memorias, tu historia</p>
        </div>
        <Link to="/experiencias/nueva" className={styles.createBtn}>
          <Plus size={20} />
          Nueva experiencia
        </Link>
      </header>

      {/* Filters & View Toggle */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          {(Object.keys(typeLabels) as ExperienceType[]).map(type => (
            <button
              key={type}
              className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
              onClick={() => setFilter(type)}
            >
              {typeEmojis[type]} {typeLabels[type]}
            </button>
          ))}
        </div>
        
        <div className={styles.viewToggle}>
          <button
            className={viewMode === 'grid' ? styles.active : ''}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button
            className={viewMode === 'list' ? styles.active : ''}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Experiences */}
      {filteredExp.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📸</span>
          <h3>No hay experiencias</h3>
          <p>Captura y guarda tus mejores momentos.</p>
          <Link to="/experiencias/nueva" className={styles.emptyBtn}>
            Crear experiencia
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className={styles.grid}>
          {filteredExp.map(exp => (
            <article key={exp.id} className={styles.expCard}>
              <div className={styles.expImage}>
                {exp.photos?.[0] ? (
                  <img src={exp.photos[0]} alt={exp.title} />
                ) : (
                  <div className={styles.expImagePlaceholder}>
                    {typeEmojis[exp.type]}
                  </div>
                )}
                <span className={styles.expType}>
                  {typeEmojis[exp.type]} {typeLabels[exp.type]}
                </span>
              </div>
              <div className={styles.expContent}>
                <h3 className={styles.expTitle}>{exp.title}</h3>
                <p className={styles.expDate}>
                  <Calendar size={12} />
                  {format(exp.date, 'd MMM yyyy', { locale: es })}
                </p>
                {exp.description && (
                  <p className={styles.expDescription}>{exp.description}</p>
                )}
                {exp.photos && exp.photos.length > 0 && (
                  <span className={styles.expPhotos}>
                    <Camera size={12} />
                    {exp.photos.length}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {filteredExp.map(exp => (
            <article key={exp.id} className={styles.listItem}>
              <div className={styles.listItemImage}>
                {exp.photos?.[0] ? (
                  <img src={exp.photos[0]} alt={exp.title} />
                ) : (
                  <div className={styles.listItemPlaceholder}>
                    {typeEmojis[exp.type]}
                  </div>
                )}
              </div>
              <div className={styles.listItemContent}>
                <div className={styles.listItemHeader}>
                  <h3>{exp.title}</h3>
                  <span className={styles.listItemType}>
                    {typeLabels[exp.type]}
                  </span>
                </div>
                <p className={styles.listItemDate}>
                  {format(exp.date, 'd MMMM yyyy', { locale: es })}
                </p>
                {exp.description && (
                  <p className={styles.listItemDescription}>{exp.description}</p>
                )}
              </div>
              <button className={styles.moreBtn}>
                <MoreHorizontal size={18} />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
