// Tipos para la aplicación NA-ONTOUR

export interface User {
  id: string
  name: string
  email: string
  photoURL: string | null
  clubs: string[]
  trips: string[]
  experiences: string[]
  following: string[]
  followers: string[]
  bio: string
  createdAt: Date
}

export interface Trip {
  id: string
  userId: string
  destination: string
  matchDate: Date
  clubId: string
  photos: string[]
  status: 'planning' | 'ongoing' | 'completed'
  description: string
  createdAt: Date
}

export interface Experience {
  id: string
  userId: string
  tripId: string | null
  title: string
  description: string
  photos: string[]
  date: Date
  type: 'match' | 'travel' | 'event' | 'personal'
  createdAt: Date
}

export interface Club {
  id: string
  name: string
  logo: string
  country: string
  stadium: string
  fans: string[]
  description: string
  createdAt: Date
}

export interface Post {
  id: string
  userId: string
  content: string
  photos: string[]
  likes: string[]
  comments: Comment[]
  type: 'post' | 'trip' | 'experience'
  relatedId: string | null
  createdAt: Date
}

export interface Comment {
  id: string
  userId: string
  content: string
  createdAt: Date
}

export type TripStatus = 'planning' | 'ongoing' | 'completed'
export type ExperienceType = 'match' | 'travel' | 'event' | 'personal'
export type PostType = 'post' | 'trip' | 'experience'
