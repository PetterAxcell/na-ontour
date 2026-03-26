# NA-ONTOUR - Especificación Técnica Completa

## 1. Visión del Producto

**NA-ONTOUR** es la plataforma que convierte cada desplazamiento de un aficionado al fútbol en una aventura memorable. No es solo otra app de resultados o fichajes — es tu **compañera de viaje deportivo**.

Imagina que tu equipo juega en una ciudad que nunca has visitado. NA-ONTOUR te ayuda a encontrar:
- 🎫 Cómo conseguir entradas para el partido
- 🏨 Alojamientos cerca del estadio
- 🍽️ Los mejores sitios para comer antes del partido
- 📸 Lugares icónicos para visitar mientras estás ahí
- 👥 Otros aficionados con los que compartir la experiencia

**NA-ONTOUR transforma un simple partido en un viaje inolvidable.**

---

## 2. Stack Tecnológico

### Web (React + TypeScript + Vite)
- **Framework:** React 18 con TypeScript
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **UI Icons:** Lucide React
- **Dates:** date-fns con locale español
- **Firebase:** SDK v10 con react-firebase-hooks

### Mobile (React Native + Expo)
- **Framework:** Expo SDK 52
- **Navigation:** React Navigation (bottom tabs)
- **Firebase:** Expo Firebase SDK
- **Camera/Gallery:** expo-camera, expo-image-picker

### Backend (Firebase Cloud Functions)
- **Runtime:** Node.js 18
- **Framework:** Firebase Functions v4
- **Admin SDK:** firebase-admin v11

### Infrastructure
- **Database:** Cloud Firestore
- **Auth:** Firebase Authentication (Email + Google)
- **Storage:** Firebase Storage
- **Hosting:** Firebase Hosting (web) + EAS (mobile)

---

## 3. Modelo de Datos (Firestore)

### Collection: `users`
```typescript
interface User {
  id: string                    // Firebase Auth UID
  name: string
  email: string
  photoURL: string | null
  bio: string
  homeCity: string
  homeCountry: string
  faniqScore: number            // Puntos de fidelidad
  badges: string[]              // IDs de badges ganados
  favoriteTeams: string[]       // Club IDs
  trips: string[]               // Trip IDs
  experiences: string[]         // Experience IDs
  following: string[]           // User IDs que sigue
  followers: string[]           // User IDs que le siguen
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection: `trips`
```typescript
interface Trip {
  id: string
  userId: string
  title: string
  description: string
  destinationCity: string
  destinationCountry: string
  matchDate: Timestamp
  clubId: string                // Club que visita
  opponentClubId: string        // Club rival
  startDate: Timestamp
  endDate: Timestamp
  status: 'planning' | 'ongoing' | 'completed'
  itinerary: ItineraryItem[]
  photos: string[]              // URLs de Storage
  companions: string[]          // User IDs
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface ItineraryItem {
  day: number
  title: string
  description: string
  time: string
  location?: {
    lat: number
    lng: number
    address: string
  }
}
```

### Collection: `experiences`
```typescript
interface Experience {
  id: string
  userId: string
  tripId: string | null
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
    city: string
    country: string
  }
  clubId: string | null
  photos: string[]
  tags: string[]
  rating: number               // 1-5
  type: 'match' | 'travel' | 'event' | 'personal'
  isPublic: boolean
  likes: string[]              // User IDs
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection: `clubs`
```typescript
interface Club {
  id: string
  name: string
  shortName: string
  logo: string                  // URL
  coverImage: string            // URL
  description: string
  foundedYear: number
  stadium: {
    name: string
    address: string
    lat: number
    lng: number
    capacity: number
  }
  city: string
  country: string
  league: string
  colors: string[]              // hex colors
  fans: string[]                // User IDs
  socialMedia: {
    twitter?: string
    instagram?: string
    facebook?: string
    website?: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection: `posts`
```typescript
interface Post {
  id: string
  userId: string
  content: string
  photos: string[]
  likes: string[]
  commentsCount: number
  type: 'post' | 'trip' | 'experience' | 'club'
  relatedId: string | null      // ID del recurso relacionado
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Subcollection: `posts/{postId}/comments`
```typescript
interface Comment {
  id: string
  userId: string
  content: string
  createdAt: Timestamp
}
```

---

## 4. API Reference

### Autenticación

#### Email/Password
```typescript
// Registro
createUserWithEmailAndPassword(auth, email, password)

// Login
signInWithEmailAndPassword(auth, email, password)

// Logout
signOut(auth)

// Estado de autenticación
onAuthStateChanged(auth, callback)
```

#### Google Sign-In
```typescript
import { GoogleAuthProvider } from 'firebase/auth'

const provider = new GoogleAuthProvider()
signInWithPopup(auth, provider)
```

### Firestore Operations

#### Users
```typescript
// Crear usuario
await setDoc(doc(db, 'users', userId), { ...userData })

// Obtener usuario
const userDoc = await getDoc(doc(db, 'users', userId))

// Actualizar usuario
await updateDoc(doc(db, 'users', userId), { name: 'new name' })

// Seguir usuario
await updateDoc(doc(db, 'users', currentUserId), {
  following: arrayUnion(targetUserId)
})
```

#### Trips
```typescript
// Listar viajes de un usuario
const q = query(
  collection(db, 'trips'),
  where('userId', '==', userId),
  orderBy('matchDate', 'desc')
)

// Crear viaje
await addDoc(collection(db, 'trips'), { ...tripData })

// Actualizar viaje
await updateDoc(doc(db, 'trips', tripId), { ...updates })
```

#### Experiences
```typescript
// Listar experiencias públicas
const q = query(
  collection(db, 'experiences'),
  where('isPublic', '==', true),
  orderBy('createdAt', 'desc')
)

// Crear experiencia
await addDoc(collection(db, 'experiences'), { ...expData })
```

#### Posts (Feed Social)
```typescript
// Feed principal (usuarios que sigues)
const q = query(
  collection(db, 'posts'),
  where('userId', 'in', followingUsers),
  orderBy('createdAt', 'desc'),
  limit(20)
)

// Crear post
await addDoc(collection(db, 'posts'), { ...postData })

// Likear post
await updateDoc(doc(db, 'posts', postId), {
  likes: arrayUnion(userId)
})
```

### Cloud Functions

```typescript
// Follow user
const followUser = functions.https.onCall(async (data, context) => {
  // Body: { targetUserId: string }
  // Returns: { success: true }
})

// Unfollow user
const unfollowUser = functions.https.onCall(async (data, context) => {
  // Body: { targetUserId: string }
  // Returns: { success: true }
})

// Like post
const likePost = functions.https.onCall(async (data, context) => {
  // Body: { postId: string }
  // Returns: { success: true }
})

// Create post trigger (onTripCreated, onExperienceCreated)
// Automatically creates a post when trip/experience is created
```

---

## 5. Pantallas y Navegación

### Web (React Router)
```
/login                    → LoginScreen (público)
/                         → Layout (protegido)
  ├── /                   → HomeScreen (feed)
/viajes                   → TripsScreen
/viajes/nuevo             → CreateTripScreen
/experiencias             → ExperiencesScreen
/experiencias/nueva       → CreateExperienceScreen
/clubes                   → ClubsScreen
/perfil                   → ProfileScreen
```

### Mobile (React Navigation - Bottom Tabs)
```
Bottom Tab Navigator
├── Home Stack
│   ├── HomeScreen
│   └── PostDetailScreen
├── Viajes Stack
│   ├── TripsScreen
│   └── TripDetailScreen
├── Experiencias Stack
│   ├── ExperiencesScreen
│   └── ExperienceDetailScreen
├── Clubes Stack
│   ├── ClubsScreen
│   └── ClubDetailScreen
└── Perfil Stack
    ├── ProfileScreen
    └── EditProfileScreen
```

---

## 6. Paleta de Colores

```css
:root {
  /* Primary - Verde campo de fútbol */
  --color-primary: #1A5F2A;
  --color-primary-light: #2D8A42;
  --color-primary-dark: #0F3D19;
  
  /* Secondary - Dorado/fuego */
  --color-secondary: #F4A623;
  --color-secondary-light: #F7B94A;
  
  /* Accent - Rojo pasión */
  --color-accent: #E63946;
  --color-accent-light: #EF4853;
  
  /* Neutros */
  --color-bg: #FFFFFF;
  --color-surface: #F8F9FA;
  --color-surface-alt: #F0F2F5;
  --color-border: #DEE2E6;
  
  /* Texto */
  --color-text: #212529;
  --color-text-secondary: #6C757D;
  --color-text-muted: #ADB5BD;
}
```

### Tipografía
- **Headlines:** Space Grotesk Bold (700)
- **Body:** Inter Regular (400), Medium (500), SemiBold (600)
- **Scale:** 12, 14, 16, 18, 20, 24, 32, 40, 48px

---

## 7. Estados de Componentes

### Loading States
- Skeleton loaders animados para listas
- Spinner para acciones (botones submit)
- Progress bar para uploads de fotos

### Empty States
Cada pantalla debe tener estado vacío con:
- Icono emoji relevante
- Título descriptivo
- Mensaje motivacional
- CTA para crear contenido

### Error States
- Mensaje de error inline
- Botón de reintentar cuando aplique
- Manejo de errores de Firebase Auth

### Estados de Autenticación
- **No autenticado:** Redirección a /login
- **Loading:** LoadingScreen con spinner
- **Autenticado:** App normal
- **Error:** Mensaje con opción de reintentar

---

## 8. Reglas de Seguridad

### Firestore
- `users`: Lectura pública, escritura solo owner
- `trips`: Lectura pública, escritura solo owner
- `experiences`: Lectura pública, escritura solo owner
- `clubs`: Lectura pública, escritura autenticados
- `posts`: Lectura pública, escritura autor

### Storage
- Fotos de perfil: Solo owner, max 5MB, solo imágenes
- Fotos de viajes: Solo owner, max 10MB
- Fotos de experiencias: Solo owner, max 10MB
- Logos de clubes: Autenticados, max 5MB

---

## 9. Configuración de Entorno

### Web (.env)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Mobile (app.json / expo config)
```json
{
  "extra": {
    "firebaseApiKey": "...",
    "firebaseAuthDomain": "...",
    "firebaseProjectId": "...",
    "firebaseStorageBucket": "...",
    "firebaseMessagingSenderId": "...",
    "firebaseAppId": "..."
  }
}
```

---

## 10. Deployment

### Web (Firebase Hosting)
```bash
cd web
npm install
npm run build
firebase deploy --only hosting
```

### Mobile (Expo EAS)
```bash
cd mobile
eas build --platform ios
eas build --platform android
eas submit --platform ios
```

### Backend (Firebase Functions)
```bash
cd backend/functions
npm install
firebase deploy --only functions
```

---

## 11. Roadmap

### Fase 1: MVP ✅
- [x] Estructura del proyecto (React + React Native)
- [x] Configuración Firebase
- [x] Auth básico (email/password)
- [x] CRUD Viajes
- [x] CRUD Experiencias
- [x] CRUD Clubes
- [x] Perfil básico

### Fase 2: Social
- [ ] Follow/Unfollow
- [ ] Social feed
- [ ] Likes y comentarios
- [ ] Notificaciones

### Fase 3: Gamificación
- [ ] Faniq Score
- [ ] Badges y logros
- [ ] Rankings

### Fase 4: Google Auth
- [ ] Integración Google Sign-In
- [ ] Vincular cuentas

---

*Documento actualizado: 2024*
