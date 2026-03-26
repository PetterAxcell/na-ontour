import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '../utils/firebase'
import { useAuth } from '../contexts'
import { TripStatus } from '../types'
import { ArrowLeft, Upload, MapPin, Calendar, FileText, Image } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './CreateTripScreen.module.css'

export default function CreateTripScreen() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [destination, setDestination] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [clubId, setClubId] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TripStatus>('planning')
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
        const storageRef = ref(storage, `trips/${currentUser.uid}/${Date.now()}_${photo.name}`)
        const snapshot = await uploadBytes(storageRef, photo)
        const url = await getDownloadURL(snapshot.ref)
        photoUrls.push(url)
      }

      // Create trip document
      const tripsRef = collection(db, 'trips')
      await addDoc(tripsRef, {
        userId: currentUser.uid,
        destination,
        matchDate: new Date(matchDate),
        clubId,
        description,
        status,
        photos: photoUrls,
        createdAt: serverTimestamp()
      })

      navigate('/viajes')
    } catch (err: any) {
      setError(err.message || 'Error al crear el viaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/viajes" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1>Nuevo Viaje</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>
            <MapPin size={18} />
            Destino
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ciudad o estadio"
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <Calendar size={18} />
            Fecha del partido
          </label>
          <input
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <FileText size={18} />
            Estado del viaje
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TripStatus)}>
            <option value="planning">Planificando</option>
            <option value="ongoing">En curso</option>
            <option value="completed">Completado</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué hace especial este viaje?"
            rows={3}
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
          <Link to="/viajes" className={styles.cancelBtn}>
            Cancelar
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creando...' : 'Crear viaje'}
          </button>
        </div>
      </form>
    </div>
  )
}
