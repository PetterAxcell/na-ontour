# NA-ONTOUR 🌍⚽

> **Tu compañero de aventuras futboleras. Compite viajando, conecta con clubes, y revive cada experiencia.**

NA-ONTOUR es una aplicación social diseñada para los verdaderos aficionados del fútbol. Crea viajes a partidos, documenta tus experiencias, conecta con otros fans y vive experiencias exclusivas de tus clubes favoritos.

---

## 🚀 Visión

NA-ONTOUR nació de una verdad simple: **el fútbol se vive fuera del estadio tanto como dentro**. Cada viaje a un partido es una historia. Cada experiencia merece ser recordada. Cada club tiene una comunidad de locos跟你一样 que merecen estar conectados.

La app es tu:

- 📱 **Diario de viajes** — Registra cada partido visitado
- 📸 **Álbum de memorias** — Fotos, momentos, emociones
- 🤝 **Red social** — Conecta con aficionados de tu club y de otros
- 🎫 **Portal de experiencias** — Accede a contenido y ventajas exclusivas

---

## 🏗️ Arquitectura

```
na-ontour/
├── web/                    # React app (Vite + TypeScript)
├── mobile/                 # React Native + Expo
├── backend/                # Firebase Cloud Functions
├── docs/                   # Documentación técnica y de producto
└── README.md
```

### Stack Tecnológico

| Capa | Tecnología |
|------|-------------|
| **Web Frontend** | React 18 + TypeScript + Vite |
| **Mobile Frontend** | React Native + Expo SDK 52 |
| **Backend** | Firebase (Cloud Functions v2) |
| **Base de datos** | Firestore |
| **Auth** | Firebase Auth (Email + Google) |
| **Storage** | Firebase Storage |
| **Hosting Web** | Firebase Hosting |
| **Analytics** | Firebase Analytics |

### Modelo de Datos (Firestore)

```
/users/{userId}
  - name: string
  - email: string
  - photoURL: string | null
  - clubs: string[]           // clubIds
  - trips: string[]           // tripIds
  - experiences: string[]     // experienceIds
  - following: string[]       // userIds
  - followers: string[]       // userIds
  - createdAt: timestamp
  - bio: string

/trips/{tripId}
  - userId: string
  - destination: string
  - matchDate: timestamp
  - clubId: string
  - photos: string[]          // Storage URLs
  - status: 'planning' | 'ongoing' | 'completed'
  - description: string
  - createdAt: timestamp

/experiences/{experienceId}
  - userId: string
  - tripId: string | null
  - title: string
  - description: string
  - photos: string[]
  - date: timestamp
  - createdAt: timestamp
  - type: 'match' | 'travel' | 'event' | 'personal'

/clubs/{clubId}
  - name: string
  - logo: string              // Storage URL
  - country: string
  - stadium: string
  - fans: string[]             // userIds
  - description: string
  - createdAt: timestamp

/posts/{postId}
  - userId: string
  - content: string
  - photos: string[]
  - likes: string[]            // userIds
  - comments: Comment[]
  - type: 'post' | 'trip' | 'experience'
  - relatedId: string | null   // tripId o experienceId
  - createdAt: timestamp

/comments/{commentId}
  - postId: string
  - userId: string
  - content: string
  - createdAt: timestamp
```

---

## 📱 Pantallas

### 1. Home (Feed Social)
- Feed unificado con posts de usuarios seguidos
- Posts automáticos cuando alguien crea un viaje o experiencia
- Likes y comentarios en tiempo real
- Pull-to-refresh

### 2. Viajes (Mis Viajes)
- Lista de viajes propios y guardados
- Crear nuevo viaje: destino, fecha, club, descripción
- Estados: planning → ongoing → completed
- Galería de fotos del viaje
- Compartir viaje como post

### 3. Experiencias (Memorias)
- Timeline personal de experiencias
- Galería grid con filtros por fecha/tipo
- Crear experiencia: título, descripción, fotos, tipo
- Vinculable a un viaje o independiente

### 4. Clubes
- Buscar clubes por nombre o país
- Ver detalle: logo, stadium, descripción, fans
- Seguir/dejar de seguir clubes
- Feed del club (posts relacionados)

### 5. Perfil
- Mi información: nombre, foto, bio
- Mis viajes y experiencias recientes
- Estadísticas: viajes, experiencias, clubes seguidos
- Configuración: editar perfil, notificaciones, cerrar sesión

---

## 🎨 Diseño

### Identidad Visual
- **Nombre:** NA-ONTOUR
- **Tagline:** "Vive el fútbol, más allá del partido"
- **Emoji:** 🌍⚽

### Paleta de Colores
```
Primary:       #1A5F2A   (Verde campo de fútbol)
Secondary:     #F4A623   (Dorado/fuego)
Accent:        #E63946   (Rojo pasión)
Background:    #FFFFFF
Surface:       #F8F9FA
Text Primary:  #212529
Text Secondary:#6C757D
```

### Tipografía
- **Headlines:** Inter Bold
- **Body:** Inter Regular
- **Accent:** Space Grotesk

### Iconografía
- Lucide React (web)
- @expo/vector-icons (mobile)

---

## 📦 Desarrollo

### Requisitos
- Node.js 18+
- npm o yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)
- Cuenta de Firebase (plan Spark o Blaze)

### Setup Local

```bash
# Clonar repositorio
git clone https://github.com/PetterAxcell/na-ontour.git
cd na-ontour

# Instalar dependencias web
cd web && npm install

# Instalar dependencias mobile
cd ../mobile && npm install

# Setup Firebase
firebase login
firebase init
```

### Scripts Disponibles

**Web:**
```bash
cd web
npm run dev      # Desarrollo (localhost:5173)
npm run build    # Build producción
npm run preview  # Preview build
```

**Mobile:**
```bash
cd mobile
npx expo start   # Metro bundler
npx expo run:ios # iOS simulator
npx expo run:android # Android
```

### Variables de Entorno

**Web (`web/.env`):**
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

**Mobile (`mobile/app.json` + `.env`):**
```env
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
```

---

## 🚀 Despliegue

### Web (Firebase Hosting)
```bash
cd web
npm run build
firebase deploy --only hosting
```

### Mobile (Expo)
```bash
cd mobile
eas build --platform ios        # Build iOS
eas build --platform android    # Build Android
eas submit --platform ios       # Submit a App Store
eas submit --platform android   # Submit a Play Store
```

---

## 🔮 Roadmap

### v1.0.0 - MVP
- [x] Estructura del proyecto
- [x] Auth con email (Firebase)
- [x] CRUD de viajes
- [x] CRUD de experiencias
- [x] Feed social básico
- [x] Perfil de usuario

### v1.1.0 - Social
- [ ] Seguir/dejar de seguir usuarios
- [ ] Likes y comentarios
- [ ] Notificaciones
- [ ] Buscar usuarios

### v1.2.0 - Clubes
- [ ] Catálogo de clubes
- [ ] Seguir clubes
- [ ] Feed del club
- [ ] Experiencias exclusivas

### v2.0.0 - Google Auth + Extras
- [ ] Login con Google
- [ ] App en App Store / Play Store
- [ ] Deep linking
- [ ] Push notifications

---

## 📄 Licencia

MIT © 2024 NA-ONTOUR

---

## 👥 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Commit tus cambios (`git commit -m 'Add nueva función'`)
4. Push a la rama (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

*Vive el fútbol, más allá del partido.* 🌍⚽
