# NA-ONTOUR ⚽✈️

> **Compite viajando. Recuerda experiencias. Conecta clubes y aficionados.**

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)

---

## 🎯 Visión

**NA-ONTOUR** es la plataforma que convierte cada desplazamiento de un aficionado al fútbol en una aventura memorable. No es solo otra app de resultados o fichajes — es tu **compañera de viaje deportivo**.

Imagina que tu equipo juega en una ciudad que nunca has visitado. NA-ONTOUR te ayuda a encontrar:
- 🎫 Cómo conseguir entradas para el partido
- 🏨 Alojamientos cerca del estadio
- 🍽️ Los mejores sitios para comer antes del partido
- 📸 Lugares icónicos para visitar mientras estás ahí
- 👥 Otros aficionados con los que compartir la experiencia

**NA-ONTOUR transforma un simple partido en un viaje inolvidable.**

---

## ✨ Funcionalidades

### 1. 📅 Gestión de Viajes Deportivos
- Crear y gestionar viajes alrededor de partidos
- Itinerarios personalizados día a día
- Invitar a compañeros de viaje
- Historial completo de viajes

### 2. 📸 Registro de Experiencias
- Diario de viaje con fotos, notas y ubicación
- Experiencias vinculadas a clubes específicos
- Experiencias personales/memories
- Tags y categorización

### 3. 🏟️ Conexión con Clubes
- Perfiles de clubes con estadios y datos
- Experiencias exclusivas por club
- Faniq Score: tu nivel de fidelidad
- Badges y logros

### 4. 👥 Red Social de Aficionados
- Perfil de aficionado personalizable
- Social feed con actividad de usuarios
- Follow/unfollow entre usuarios
- Comentarios y likes en experiencias

---

## 🏗️ Arquitectura

```
na-ontour/
├── web/                    # React SPA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── screens/        # Páginas/Vistas
│   │   ├── contexts/       # React Context (Auth)
│   │   ├── services/       # Firebase services
│   │   ├── utils/          # Firebase config
│   │   ├── types/          # TypeScript types
│   │   └── hooks/          # Custom hooks
│   └── public/
│
├── mobile/                 # React Native + Expo
│   ├── src/
│   │   ├── screens/        # Pantallas
│   │   ├── components/     # Componentes
│   │   ├── services/       # Firebase services
│   │   ├── context/        # Auth context
│   │   └── navigation/     # React Navigation
│   └── assets/
│
├── backend/
│   └── functions/          # Firebase Cloud Functions
│       └── src/
│
├── docs/                   # Documentación técnica
│   ├── SPEC.md            # Especificación completa
│   ├── MOCKUPS.md         # Wireframes y mockups
│   └── TECNICA.md         # Documentación técnica
│
├── firebase.json           # Firebase config
├── firestore.rules         # Reglas de Firestore
└── storage.rules           # Reglas de Storage
```

---

## 🔥 Firebase Setup

### Servicios utilizados:
- **Firebase Auth**: Autenticación (Email + Google)
- **Firestore**: Base de datos NoSQL
- **Firebase Storage**: Almacenamiento de imágenes
- **Firebase Hosting**: Hosting para web
- **Expo**: Despliegue móvil

---

## 🚀 Setup y Desarrollo

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Firebase (gratuita en [Firebase Console](https://console.firebase.google.com/))
- Expo CLI (`npm install -g expo-cli`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/PetterAxcell/na-ontour.git
cd na-ontour
```

### 2. Crear proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** → Email/Password y Google
4. Habilita **Firestore Database** → Crea en modo producción
5. Habilita **Storage** → Crea en modo producción
6. Registra tu app web en Configuración del proyecto

### 3. Configurar variables de entorno

**Web (`web/.env`):**
```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Mobile (`mobile/app.json` o `app.config.ts`):**
```json
{
  "extra": {
    "firebaseApiKey": "tu-api-key",
    "firebaseAuthDomain": "tu-proyecto.firebaseapp.com",
    "firebaseProjectId": "tu-proyecto-id",
    "firebaseStorageBucket": "tu-proyecto.appspot.com",
    "firebaseMessagingSenderId": "123456789",
    "firebaseAppId": "1:123456789:android:abc123"
  }
}
```

### 4. Instalar dependencias

```bash
# Web
cd web
npm install

# Mobile
cd ../mobile
npm install

# Backend (Functions)
cd ../backend/functions
npm install
```

### 5. Ejecutar en desarrollo

```bash
# Web
cd web
npm run dev
# Abre http://localhost:5173

# Mobile
cd mobile
npx expo start
# Escanea QR con Expo Go (Android) o Camera (iOS)

# Backend (Emuladores)
cd backend/functions
npm run serve
```

---

## 📱 Despliegue

### Web (Firebase Hosting)

```bash
cd web
npm run build
firebase deploy --only hosting
```

### Mobile (Expo EAS)

```bash
cd mobile

# Build para iOS (requiere cuenta de Apple Developer)
eas build --platform ios

# Build para Android
eas build --platform android

# Submit a tiendas
eas submit --platform ios
eas submit --platform android
```

### Backend (Firebase Functions)

```bash
cd backend/functions
firebase deploy --only functions
```

---

## 🔧 Scripts Disponibles

### Web
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Linting con ESLint |

### Mobile
| Script | Descripción |
|--------|-------------|
| `npx expo start` | Inicia Expo |
| `npx expo run:ios` | Ejecuta en iOS |
| `npx expo run:android` | Ejecuta en Android |
| `eas build` | Build con EAS |

### Backend
| Script | Descripción |
|--------|-------------|
| `npm run serve` | Inicia emuladores locales |
| `npm run shell` | Inicia shell de functions |
| `npm run deploy` | Despliega a producción |
| `npm run logs` | Ver logs de functions |

---

## 📂 Estructura de Datos (Firestore)

```
/users/{userId}
  - email, name, photoURL, bio
  - faniqScore, badges, favoriteTeams
  - trips[], experiences[], following[], followers[]
  - createdAt, updatedAt

/trips/{tripId}
  - userId, title, description
  - destinationCity, destinationCountry
  - matchDate, clubId, opponentClubId
  - startDate, endDate, status
  - itinerary[], photos[], companions[]
  - createdAt, updatedAt

/experiences/{experienceId}
  - userId, tripId (optional)
  - title, description, location
  - clubId, photos[], tags[], rating
  - type: 'match' | 'travel' | 'event' | 'personal'
  - isPublic, likes[]
  - createdAt, updatedAt

/clubs/{clubId}
  - name, shortName, logo, coverImage
  - description, foundedYear
  - stadium{ name, address, lat, lng, capacity }
  - city, country, league, colors[]
  - fans[], socialMedia{}
  - createdAt, updatedAt

/posts/{postId}
  - userId, content, photos[]
  - likes[], commentsCount
  - type: 'post' | 'trip' | 'experience' | 'club'
  - relatedId
  - createdAt, updatedAt
```

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#1A5F2A` | Verde campo de fútbol |
| Primary Light | `#2D8A42` | Hover states |
| Secondary | `#F4A623` | Dorado/fuego |
| Accent | `#E63946` | Rojo pasión |
| Background | `#FFFFFF` | Fondo principal |
| Surface | `#F8F9FA` | Cards, contenedores |
| Text | `#212529` | Texto principal |
| Text Secondary | `#6C757D` | Texto secundario |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Commit (`git commit -am 'Agrega nueva función'`)
4. Push (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License

---

**NA-ONTOUR** — *Porque cada viaje cuenta.*
