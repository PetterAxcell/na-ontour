# NA-ONTOUR - Especificaciones Técnicas

## Overview
NA-ONTOUR es una plataforma para aficionados al fútbol que desean transformar sus viajes a partidos en experiencias memorables.

## Stack Tecnológico

### Web (React)
- **Framework**: React 18
- **Language**: JavaScript/TypeScript
- **Routing**: React Router v6
- **State**: React Context (AuthContext)
- **Styling**: Custom CSS

### Mobile (React Native + Expo)
- **Framework**: Expo SDK 50
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State**: React Context

### Backend (Firebase)
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Functions**: Cloud Functions for Firebase
- **Hosting**: Firebase Hosting

## Firestore Schema

```
/users/{userId}
  - email: string
  - username: string
  - displayName: string
  - avatarUrl: string
  - bio: string
  - faniqScore: number
  - badges: string[]
  - homeCity: string
  - homeCountry: string
  - following: string[]
  - followers: string[]
  - favoriteTeams: string[]
  - createdAt: timestamp
  - updatedAt: timestamp

/trips/{tripId}
  - userId: string
  - title: string
  - description: string
  - destinationCity: string
  - destinationCountry: string
  - matchDate: timestamp
  - clubId: string
  - opponentClubId: string
  - startDate: timestamp
  - endDate: timestamp
  - status: 'planning' | 'ongoing' | 'completed' | 'cancelled'
  - itinerary: ItineraryDay[]
  - photos: string[]
  - companions: string[]
  - createdAt: timestamp
  - updatedAt: timestamp

/experiences/{experienceId}
  - userId: string
  - tripId: string (optional)
  - title: string
  - description: string
  - type: 'match' | 'sightseeing' | 'food' | 'accommodation' | 'transport'
  - location: { lat, lng, address, city, country }
  - clubId: string
  - photos: string[]
  - tags: string[]
  - rating: number
  - isPublic: boolean
  - likes: string[]
  - comments: Comment[]
  - createdAt: timestamp
  - updatedAt: timestamp

/clubs/{clubId}
  - name: string
  - shortName: string
  - logoUrl: string
  - coverImageUrl: string
  - description: string
  - foundedYear: number
  - stadium: { name, address, lat, lng, capacity }
  - city: string
  - country: string
  - league: string
  - colors: string[]
  - fansCount: number
  - socialMedia: { twitter, instagram, facebook }
  - createdAt: timestamp
  - updatedAt: timestamp
```

## Security Rules

- Users can only read all public data
- Users can only write to their own documents
- Experiences: public experiences are readable by all authenticated users
- Clubs: read-only for regular users (admin manages)

## Cloud Functions

1. **onExperienceCreated**: Incrementa Faniq Score (+10) y detecta badges
2. **onTripCreated**: Incrementa Faniq Score (+20) y detecta badges
3. **onFollowUser**: Actualiza following/followers bidireccionalmente
4. **onUserFollowClub**: Actualiza favoriteTeams y fansCount

## Gamification (Faniq Score)

- Crear experiencia: +10 puntos
- Crear viaje: +20 puntos
- Seguir usuario: +5 puntos
- Viaje completado: +50 puntos

## Badges

- first_experience: Primera experiencia creada
- 10_experiences: 10 experiencias creadas
- 50_experiences: 50 experiencias creadas
- first_trip: Primer viaje creado
- 5_trips: 5 viajes creados

## Roadmap

- [x] MVP con auth y CRUD básico
- [x] Feed social básico
- [ ] Notificaciones push
- [ ] Integración Google Sign-In
- [ ] Pagos/reservas
- [ ] Versión web completa
