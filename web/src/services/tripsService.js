import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Trips collection reference
const tripsRef = collection(db, 'trips');

// Create a new trip
export const createTrip = async (tripData) => {
  try {
    const trip = {
      ...tripData,
      status: 'planning',
      itinerary: tripData.itinerary || [],
      photos: tripData.photos || [],
      companions: tripData.companions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(tripsRef, trip);
    return { id: docRef.id, ...trip };
  } catch (error) {
    throw error;
  }
};

// Get a single trip by ID
export const getTrip = async (tripId) => {
  try {
    const tripDoc = await getDoc(doc(db, 'trips', tripId));
    if (tripDoc.exists()) {
      return { id: tripDoc.id, ...tripDoc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get trips by user ID
export const getTripsByUser = async (userId, filters = {}) => {
  try {
    let q = query(tripsRef, where('userId', '==', userId));
    
    if (filters.status) {
      q = query(tripsRef, where('userId', '==', userId), where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('startDate', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Get upcoming trips for a user
export const getUpcomingTrips = async (userId) => {
  try {
    const now = new Date().toISOString();
    const q = query(
      tripsRef, 
      where('userId', '==', userId),
      where('startDate', '>=', now),
      orderBy('startDate', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Update a trip
export const updateTrip = async (tripId, updates) => {
  try {
    await updateDoc(doc(db, 'trips', tripId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updatedTrip = await getTrip(tripId);
    return updatedTrip;
  } catch (error) {
    throw error;
  }
};

// Delete a trip
export const deleteTrip = async (tripId) => {
  try {
    await deleteDoc(doc(db, 'trips', tripId));
    return true;
  } catch (error) {
    throw error;
  }
};

// Add companion to trip
export const addCompanion = async (tripId, companionId) => {
  try {
    const trip = await getTrip(tripId);
    if (!trip) throw new Error('Trip not found');
    
    if (!trip.companions.includes(companionId)) {
      const companions = [...trip.companions, companionId];
      await updateTrip(tripId, { companions });
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Add photo to trip
export const addTripPhoto = async (tripId, photoUrl) => {
  try {
    const trip = await getTrip(tripId);
    if (!trip) throw new Error('Trip not found');
    
    const photos = [...(trip.photos || []), photoUrl];
    await updateTrip(tripId, { photos });
    
    return photos;
  } catch (error) {
    throw error;
  }
};
