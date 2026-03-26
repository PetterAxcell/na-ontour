# Documentación Técnica - NA-ONTOUR

## Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Modelo de Datos](#modelo-de-datos)
4. [API Firebase](#api-firebase)
5. [Guías de Desarrollo](#guías-de-desarrollo)

---

## Visión General

NA-ONTOUR es una aplicación social para aficionados del fútbol que permite:
- Crear y gestionar viajes a partidos
- Documentar experiencias con fotos
- Conectar con otros aficionados
- Seguir clubes y ver experiencias exclusivas

### Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Web Frontend | React + TypeScript + Vite | React 18, Vite 5 |
| Mobile Frontend | React Native + Expo | Expo SDK 52 |
| Backend | Firebase Cloud Functions | v2 |
| Base de Datos | Firestore | - |
| Auth | Firebase Auth | - |
| Storage | Firebase Storage | - |
| Hosting | Firebase Hosting | - |

---

## Arquitectura

```
na-ontour/
├── web/                    # React SPA
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── screens/        # Vistas/páginas
│   │   ├── contexts/       # Contextos React (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilidades (Firebase)
│   │   └── types/         # Tipos TypeScript
│   └── public/
│
├── mobile/                 # React Native + Expo
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   └── utils/
│   └── assets/
│
├── backend/                # Firebase Functions
│   └── functions/
│       └── src/
│
└── docs/                   # Documentación
```

---

## Modelo de Datos

### Collections

#### `users`
```typescript
interface User {
  id: string
  name: string
  email: string
  photoURL: string | null
  clubs: string[]           // Club IDs
  trips: string[]           // Trip IDs
  experiences: string[]     // Experience IDs
  following: string[]       // User IDs
  followers: string[]       // User IDs
  bio: string
  createdAt: Timestamp
}
```

#### `trips`
```typescript
interface Trip {
  id: string
  userId: string
  destination: string
  matchDate: Timestamp
  clubId: string
  photos: string[]
  status: 'planning' | 'ongoing' | 'completed'
  description: string
  createdAt: Timestamp
}
```

#### `experiences`
```typescript
interface Experience {
  id: string
  userId: string
  tripId: string | null
  title: string
  description: string
  photos: string[]
  date: Timestamp
  type: 'match' | 'travel' | 'event' | 'personal'
  createdAt: Timestamp
}
```

#### `clubs`
```typescript
interface Club {
  id: string
  name: string
  logo: string
  country: string
  stadium: string
  fans: string[]           // User IDs
  description: string
  createdAt: Timestamp
}
```

#### `posts`
```typescript
interface Post {
  id: string
  userId: string
  content: string
  photos: string[]
  likes: string[]          // User IDs
  comments: Comment[]
  type: 'post' | 'trip' | 'experience'
  relatedId: string | null
  createdAt: Timestamp
}

interface Comment {
  id: string
  userId: string
  content: string
  createdAt: Timestamp
}
```

---

## API Firebase

### Auth
- `signInWithEmailAndPassword(email, password)`
- `createUserWithEmailAndPassword(email, password)`
- `signInWithPopup(provider)` - Google
- `signOut()`
- `onAuthStateChanged(callback)`

### Firestore
- `collection(db, 'users')`
- `doc(db, 'users', userId)`
- `addDoc(collectionRef, data)`
- `updateDoc(docRef, data)`
- `deleteDoc(docRef)`
- `query(collectionRef, where(...), orderBy(...))`
- `onSnapshot(docRef, callback)`

### Storage
- `ref(storage, path)`
- `uploadBytes(storageRef, data)`
- `getDownloadURL(storageRef)`

---

## Guías de Desarrollo

### Setup Local

```bash
# Clonar repositorio
git clone https://github.com/PetterAxcell/na-ontour.git
cd na-ontour

# Instalar dependencias web
cd web && npm install

# Instalar dependencias mobile
cd ../mobile && npm install

# Instalar dependencias backend
cd ../backend && npm install
```

### Variables de Entorno

Crear `.env` en `web/`:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### Deployment

```bash
# Web - Firebase Hosting
cd web
npm run build
firebase deploy --only hosting

# Mobile - Expo
cd mobile
eas build --platform ios
eas build --platform android

# Backend - Firebase Functions
cd backend
npm run deploy
```

### Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any profile
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    // Trips - owner only
    match /trips/{tripId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Experiences - owner only
    match /experiences/{experienceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Posts - public read, owner write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Clubs - public read, authenticated write
    match /clubs/{clubId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Testing

```bash
# Web
cd web
npm run dev

# Backend functions emulator
cd backend
npm run serve
```

---

## Paleta de Colores

```
Primary:       #1A5F2A   Verde campo de fútbol
Secondary:     #F4A623   Dorado/fuego
Accent:        #E63946   Rojo pasión
Background:    #FFFFFF
Surface:       #F8F9FA
Text Primary:  #212529
Text Secondary:#6C757D
```

## Tipografía

- **Headlines:** Space Grotesk Bold
- **Body:** Inter Regular
- **Scale:** 12, 14, 16, 18, 20, 24, 32, 40px

---

*Documento actualizado: 2024*
