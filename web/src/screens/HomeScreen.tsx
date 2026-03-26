import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db, auth } from '../utils/firebase'
import { Post } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { useAuth } from '../contexts'
import styles from './HomeScreen.module.css'

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, 'posts')
        const q = query(postsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Post[]
        
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Like post:', postId)
  }

  if (loading) {
    return <div className={styles.loading}>Cargando feed...</div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Home</h1>
        <p className={styles.greeting}>¡Hola, {currentUser?.displayName || currentUser?.email}! 👋</p>
      </header>

      {/* Create Post */}
      <div className={styles.createPost}>
        <img 
          src={currentUser?.photoURL || 'https://via.placeholder.com/40'} 
          alt="Tu foto"
          className={styles.avatar}
        />
        <input 
          type="text" 
          placeholder="¿Qué estás viviendo hoy?"
          className={styles.postInput}
        />
      </div>

      {/* Feed */}
      <div className={styles.feed}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⚽</span>
            <h3>Tu feed está vacío</h3>
            <p>Sigue a otros usuarios o crea tu primer viaje para ver contenido aquí.</p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Usuario"
                  className={styles.postAvatar}
                />
                <div className={styles.postMeta}>
                  <span className={styles.postAuthor}>Usuario</span>
                  <span className={styles.postTime}>
                    {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: es })}
                  </span>
                </div>
                <button className={styles.moreBtn}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <p className={styles.postContent}>{post.content}</p>

              {post.photos?.length > 0 && (
                <div className={styles.postPhotos}>
                  {post.photos.map((photo, idx) => (
                    <img key={idx} src={photo} alt="" className={styles.postPhoto} />
                  ))}
                </div>
              )}

              <div className={styles.postActions}>
                <button 
                  className={`${styles.actionBtn} ${post.likes?.includes(auth.currentUser?.uid || '') ? styles.liked : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart size={18} />
                  <span>{post.likes?.length || 0}</span>
                </button>
                <button className={styles.actionBtn}>
                  <MessageCircle size={18} />
                  <span>{post.comments?.length || 0}</span>
                </button>
                <button className={styles.actionBtn}>
                  <Share2 size={18} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
