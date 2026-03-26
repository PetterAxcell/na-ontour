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
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

const experiencesRef = collection(db, 'experiences');

// Create a new experience
export const createExperience = async (experienceData) => {
  try {
    const experience = {
      ...experienceData,
      type: experienceData.type || 'sightseeing',
      photos: experienceData.photos || [],
      tags: experienceData.tags || [],
      likes: [],
      comments: [],
      isPublic: experienceData.isPublic !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(experiencesRef, experience);
    return { id: docRef.id, ...experience };
  } catch (error) {
    throw error;
  }
};

// Get a single experience by ID
export const getExperience = async (experienceId) => {
  try {
    const expDoc = await getDoc(doc(db, 'experiences', experienceId));
    if (expDoc.exists()) {
      return { id: expDoc.id, ...expDoc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get experiences with filters
export const getExperiences = async (filters = {}) => {
  try {
    let q = query(experiencesRef);
    
    if (filters.userId) {
      q = query(experiencesRef, where('userId', '==', filters.userId));
    }
    
    if (filters.type) {
      q = query(experiencesRef, where('type', '==', filters.type));
    }
    
    if (filters.isPublic !== undefined) {
      q = query(experiencesRef, where('isPublic', '==', filters.isPublic));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(50));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Get experiences by trip ID
export const getExperiencesByTrip = async (tripId) => {
  try {
    const q = query(
      experiencesRef, 
      where('tripId', '==', tripId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Get experiences by club ID
export const getExperiencesByClub = async (clubId) => {
  try {
    const q = query(
      experiencesRef, 
      where('clubId', '==', clubId),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Update an experience
export const updateExperience = async (experienceId, updates) => {
  try {
    await updateDoc(doc(db, 'experiences', experienceId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updated = await getExperience(experienceId);
    return updated;
  } catch (error) {
    throw error;
  }
};

// Delete an experience
export const deleteExperience = async (experienceId) => {
  try {
    await deleteDoc(doc(db, 'experiences', experienceId));
    return true;
  } catch (error) {
    throw error;
  }
};

// Like an experience
export const likeExperience = async (experienceId, userId) => {
  try {
    await updateDoc(doc(db, 'experiences', experienceId), {
      likes: arrayUnion(userId),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Unlike an experience
export const unlikeExperience = async (experienceId, userId) => {
  try {
    await updateDoc(doc(db, 'experiences', experienceId), {
      likes: arrayRemove(userId),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Add comment to experience
export const addComment = async (experienceId, comment) => {
  try {
    const commentData = {
      id: Date.now().toString(),
      userId: comment.userId,
      username: comment.username,
      displayName: comment.displayName,
      text: comment.text,
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'experiences', experienceId), {
      comments: arrayUnion(commentData),
      updatedAt: new Date().toISOString()
    });
    
    return commentData;
  } catch (error) {
    throw error;
  }
};

// Get public feed of experiences
export const getPublicFeed = async (limitCount = 20) => {
  try {
    const q = query(
      experiencesRef,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};
