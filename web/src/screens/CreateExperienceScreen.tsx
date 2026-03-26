import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '../utils/firebase'
import { useAuth } from '../contexts'
import { ExperienceType } from '../types'
import { ArrowLeft, Upload, Calendar, FileText, Image, Tag } from 'lucide-react'
import styles from './CreateExperienceScreen.module.css'

const typeOptions: { value: ExperienceType; label: string; emoji: string }[] = [
  { value: 'match', label: 'Partido', emoji: '⚽' },
  { value: 'travel', label: 'Viaje', emoji: '✈️' },
  { value: 'event', label: 'Evento', emoji: '🎉' },
  { value: 'personal', label: 'Personal', emoji: '💭' }
]

export default function CreateExperienceScreen() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<ExperienceType>('personal')
  const [tripId, setTripId] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError('Debes estar autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Upload photos
      const photoUrls: string[] = []
      for (const photo of photos) {
        const storageRef = ref(storage, `experiences/${currentUser.uid}/${Date.now()}_${photo.name}`)
        const snapshot = await uploadBytes(storageRef, photo)
        const url = await getDownloadURL(snapshot.ref)
        photoUrls.push(url)
      }

      // Create experience document
      const expRef = collection(db, 'experiences')
      await addDoc(expRef, {
        userId: currentUser.uid,
        tripId: tripId || null,
        title,
        description,
        date: new Date(date),
        type,
        photos: photoUrls,
        createdAt: serverTimestamp()
      })

      navigate('/experiencias')
    } catch (err: any) {
      setError(err.message || 'Error al crear la experiencia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/experiencias" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1>Nueva Experiencia</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>
            <FileText size={18} />
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Un título memorable..."
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <Calendar size={18} />
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <Tag size={18} />
            Tipo de experiencia
          </label>
          <div className={styles.typeGrid}>
            {typeOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.typeBtn} ${type === opt.value ? styles.active : ''}`}
                onClick={() => setType(opt.value)}
              >
                <span className={styles.typeEmoji}>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cuéntanos qué pasó..."
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label>
            <Image size={18} />
            Fotos
          </label>
          <div className={styles.photoUpload}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className={styles.fileInput}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className={styles.uploadLabel}>
              <Upload size={20} />
              <span>Subir fotos</span>
            </label>
            
            {photos.length > 0 && (
              <div className={styles.photoPreview}>
                {photos.map((photo, index) => (
                  <div key={index} className={styles.photoItem}>
                    <img src={URL.createObjectURL(photo)} alt="" />
                    <button type="button" onClick={() => removePhoto(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Link to="/experiencias" className={styles.cancelBtn}>
            Cancelar
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar experiencia'}
          </button>
        </div>
      </form>
    </div>
  )
}
