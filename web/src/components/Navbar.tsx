import { NavLink } from 'react-router-dom'
import { Home, Plane, Camera, Users, User } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌍⚽</span>
          <span className={styles.logoText}>NA-ONTOUR</span>
        </NavLink>

        <ul className={styles.nav}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              end
            >
              <Home size={20} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/viajes" 
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Plane size={20} />
              <span>Viajes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/experiencias" 
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Camera size={20} />
              <span>Experiencias</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/clubes" 
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Users size={20} />
              <span>Clubes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/perfil" 
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <User size={20} />
              <span>Perfil</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
