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
  limit,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

const clubsRef = collection(db, 'clubs');

// Create a new club (admin only in production)
export const createClub = async (clubData) => {
  try {
    const club = {
      ...clubData,
      fansCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(clubsRef, club);
    return { id: docRef.id, ...club };
  } catch (error) {
    throw error;
  }
};

// Get a single club by ID
export const getClub = async (clubId) => {
  try {
    const clubDoc = await getDoc(doc(db, 'clubs', clubId));
    if (clubDoc.exists()) {
      return { id: clubDoc.id, ...clubDoc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get all clubs with optional filters
export const getClubs = async (filters = {}) => {
  try {
    let q = query(clubsRef);
    
    if (filters.search) {
      // Note: Firestore doesn't support OR queries, this is simplified
      q = query(clubsRef, orderBy('name'));
    }
    
    if (filters.league) {
      q = query(clubsRef, where('league', '==', filters.league));
    }
    
    if (filters.country) {
      q = query(clubsRef, where('country', '==', filters.country));
    }
    
    q = query(q, orderBy('fansCount', 'desc'), limit(50));
    
    const snapshot = await getDocs(q);
    let clubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side filter for search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      clubs = clubs.filter(club => 
        club.name.toLowerCase().includes(searchLower) ||
        club.shortName.toLowerCase().includes(searchLower)
      );
    }
    
    return clubs;
  } catch (error) {
    throw error;
  }
};

// Get clubs by city
export const getClubsByCity = async (city) => {
  try {
    const q = query(
      clubsRef, 
      where('city', '==', city),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Get popular clubs (by fans count)
export const getPopularClubs = async (limitCount = 10) => {
  try {
    const q = query(
      clubsRef, 
      orderBy('fansCount', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Update a club
export const updateClub = async (clubId, updates) => {
  try {
    await updateDoc(doc(db, 'clubs', clubId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updated = await getClub(clubId);
    return updated;
  } catch (error) {
    throw error;
  }
};

// Increment fans count
export const incrementFansCount = async (clubId) => {
  try {
    await updateDoc(doc(db, 'clubs', clubId), {
      fansCount: increment(1),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Decrement fans count
export const decrementFansCount = async (clubId) => {
  try {
    await updateDoc(doc(db, 'clubs', clubId), {
      fansCount: increment(-1),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Delete a club
export const deleteClub = async (clubId) => {
  try {
    await deleteDoc(doc(db, 'clubs', clubId));
    return true;
  } catch (error) {
    throw error;
  }
};
