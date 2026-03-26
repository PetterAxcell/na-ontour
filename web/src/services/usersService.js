import { 
  doc, 
  getDoc, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

// Get a user by ID
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUser = async (userId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updated = await getUser(userId);
    return updated;
  } catch (error) {
    throw error;
  }
};

// Follow a user
export const followUser = async (currentUserId, targetUserId) => {
  try {
    // Update current user's following list
    await updateDoc(doc(db, 'users', currentUserId), {
      following: arrayUnion(targetUserId),
      updatedAt: new Date().toISOString()
    });
    
    // Update target user's followers list
    await updateDoc(doc(db, 'users', targetUserId), {
      followers: arrayUnion(currentUserId),
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    await updateDoc(doc(db, 'users', currentUserId), {
      following: arrayRemove(targetUserId),
      updatedAt: new Date().toISOString()
    });
    
    await updateDoc(doc(db, 'users', targetUserId), {
      followers: arrayRemove(currentUserId),
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Add club to favorites
export const addFavoriteTeam = async (userId, clubId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      favoriteTeams: arrayUnion(clubId),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Remove club from favorites
export const removeFavoriteTeam = async (userId, clubId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      favoriteTeams: arrayRemove(clubId),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Increment user's Faniq Score
export const incrementFaniqScore = async (userId, points = 10) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      faniqScore: increment(points),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Add badge to user
export const addBadge = async (userId, badge) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      badges: arrayUnion(badge),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};
