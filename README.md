# NA-ONTOUR ⚽✈️

> **Compite viajando. Recuerda experiencias. Conecta clubes y aficionados.**

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

### Stack Tecnológico

**Web (React)**
```
web/
├── public/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── screens/          # Páginas/Vistas
│   ├── context/          # React Context (Auth, Theme)
│   ├── services/         # Firebase, API calls
│   └── styles/           # CSS/Estilos
├── package.json
└── firebase.json
```

**Mobile (React Native + Expo)**
```
mobile/
├── app.json
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── screens/          # Pantallas
│   ├── context/          # React Context
│   ├── services/         # Firebase, API
│   └── hooks/            # Custom hooks
├── package.json
└── App.tsx
```

**Backend (Firebase Functions)**
```
backend/
└── functions/
    ├── src/
    │   ├── index.ts
    │   └── ... (Cloud Functions)
    └── package.json
```

---

## 🔥 Firebase Setup

### Servicios utilizados:
- **Firebase Auth**: Autenticación (Google将来)
- **Firestore**: Base de datos NoSQL
- **Firebase Storage**: Almacenamiento de imágenes
- **Firebase Hosting**: Hosting para web
- **Expo**: Despliegue móvil

### Estructura Firestore:

```
/users/{userId}
  - email, username, displayName, avatarUrl, bio
  - faniqScore, badges, homeCity, homeCountry
  - following[], followers[], favoriteTeams[]
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
  - title, description, type
  - location{ lat, lng, address, city, country }
  - clubId, photos[], tags[], rating
  - isPublic, likes[], comments[]
  - createdAt, updatedAt

/clubs/{clubId}
  - name, shortName, logoUrl, coverImageUrl
  - description, foundedYear
  - stadium{ name, address, lat, lng, capacity }
  - city, country, league, colors[]
  - fansCount, socialMedia{}
  - createdAt, updatedAt
```

---

## 📱 Pantallas

### Web
1. **Landing/Auth** - Login, Register
2. **Home/Dashboard** - Feed, próximo viaje, estadísticas
3. **Viajes** - Lista, crear, detalle
4. **Experiencias** - Grid, crear, detalle
5. **Explorar Clubes** - Lista de clubes, detalle
6. **Perfil** - Mi perfil, editar, configuración
7. **Social** - Feed de actividad, descubrir usuarios

### Mobile (Expo)
- Mismas pantallas con diseño nativo móvil
- Bottom tab navigation
- Native feel & animations

---

## 🚀 Roadmap

### Fase 1: MVP
- [x] Estructura del proyecto (React + React Native)
- [x] Configuración Firebase
- [x] Auth básico (email/password)
- [x] Modelos de datos
- [x] CRUD Viajes
- [x] CRUD Experiencias
- [ ] CRUD Clubes
- [ ] Perfil básico

### Fase 2: Social
- [ ] Follow/Unfollow
- [ ] Social feed
- [ ] Likes y comentarios
- [ ] Descubrir usuarios

### Fase 3: Gamificación
- [ ] Faniq Score
- [ ] Badges y logros
- [ ] Rankings

### Fase 4: Auth Google
- [ ] Integración Google Sign-In
- [ ] Vincular cuentas

---

## 📦 Instalación y Desarrollo

### Web
```bash
cd web
npm install
npm start
# o
npm run build  # para producción
```

### Mobile
```bash
cd mobile
npm install
npx expo start
# Escanea QR con Expo Go
```

### Backend (Firebase Functions)
```bash
cd backend/functions
npm install
firebase emulators:start
# o
firebase deploy --only functions
```

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
