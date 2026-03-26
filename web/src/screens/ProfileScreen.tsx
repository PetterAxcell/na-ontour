import { useAuth } from '../contexts'
import { signOut, updateProfile } from 'firebase/auth'
import { auth, db } from '../utils/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, Mail, MapPin, Calendar, Plane, Camera, Users, 
  Edit2, LogOut, Settings, Shield
} from 'lucide-react'
import styles from './ProfileScreen.module.css'

export default function ProfileScreen() {
  const { currentUser, userData } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(currentUser?.displayName || '')
  const [bio, setBio] = useState(userData?.bio || '')

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return

    try {
      await updateProfile(auth.currentUser, {
        displayName: name
      })
      
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name,
        bio
      })
      
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Mi Perfil</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className={styles.editBtn}>
            <Edit2 size={18} />
            Editar
          </button>
        )}
      </header>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.displayName || 'Usuario'} />
            ) : (
              <span>{currentUser?.displayName?.[0] || currentUser?.email?.[0] || '?'}</span>
            )}
          </div>
          <button className={styles.changeAvatarBtn}>
            <Camera size={16} />
          </button>
        </div>

        {editing ? (
          <div className={styles.editForm}>
            <div className={styles.field}>
              <label>
                <User size={16} />
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className={styles.field}>
              <label>
                <Settings size={16} />
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                rows={3}
              />
            </div>
            <div className={styles.editActions}>
              <button onClick={() => setEditing(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button onClick={handleUpdateProfile} className={styles.saveBtn}>
                Guardar cambios
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.userName}>{currentUser?.displayName || 'Usuario NA-ONTOUR'}</h2>
            {userData?.bio && <p className={styles.userBio}>{userData.bio}</p>}
            
            <div className={styles.userInfo}>
              <span className={styles.infoItem}>
                <Mail size={16} />
                {currentUser?.email}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <Plane size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{userData?.trips?.length || 0}</span>
          <span className={styles.statLabel}>Viajes</span>
        </div>
        <div className={styles.statCard}>
          <Camera size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{userData?.experiences?.length || 0}</span>
          <span className={styles.statLabel}>Experiencias</span>
        </div>
        <div className={styles.statCard}>
          <Users size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{userData?.clubs?.length || 0}</span>
          <span className={styles.statLabel}>Clubes</span>
        </div>
      </div>

      {/* Menu */}
      <div className={styles.menu}>
        <button className={styles.menuItem}>
          <Edit2 size={20} />
          <span>Editar perfil</span>
        </button>
        <button className={styles.menuItem}>
          <Shield size={20} />
          <span>Privacidad</span>
        </button>
        <button className={styles.menuItem}>
          <Settings size={20} />
          <span>Configuración</span>
        </button>
        <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
