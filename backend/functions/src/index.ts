import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Cloud Function to update Faniq Score when a user creates an experience
export const onExperienceCreated = functions.firestore
  .document('experiences/{experienceId}')
  .onCreate(async (snap, context) => {
    const experience = snap.data();
    const userId = experience.userId;

    try {
      // Increment user's faniqScore by 10 points
      await db.collection('users').doc(userId).update({
        faniqScore: admin.firestore.FieldValue.increment(10),
        updatedAt: new Date().toISOString()
      });

      // Check for badges
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      if (userData) {
        const experiencesCount = await db.collection('experiences')
          .where('userId', '==', userId)
          .get();

        // Award badges based on experience count
        const badges = userData.badges || [];
        
        if (experiencesCount.size >= 1 && !badges.includes('first_experience')) {
          badges.push('first_experience');
        }
        if (experiencesCount.size >= 10 && !badges.includes('10_experiences')) {
          badges.push('10_experiences');
        }
        if (experiencesCount.size >= 50 && !badges.includes('50_experiences')) {
          badges.push('50_experiences');
        }

        if (badges.length > userData.badges?.length) {
          await db.collection('users').doc(userId).update({ badges });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating faniq score:', error);
      return { success: false, error };
    }
  });

// Cloud Function to update Faniq Score when a user creates a trip
export const onTripCreated = functions.firestore
  .document('trips/{tripId}')
  .onCreate(async (snap, context) => {
    const trip = snap.data();
    const userId = trip.userId;

    try {
      await db.collection('users').doc(userId).update({
        faniqScore: admin.firestore.FieldValue.increment(20),
        updatedAt: new Date().toISOString()
      });

      // Check for trip badges
      const tripsCount = await db.collection('trips')
        .where('userId', '==', userId)
        .get();

      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const badges = userData?.badges || [];

      if (tripsCount.size >= 1 && !badges.includes('first_trip')) {
        badges.push('first_trip');
      }
      if (tripsCount.size >= 5 && !badges.includes('5_trips')) {
        badges.push('5_trips');
      }

      if (badges.length > userData?.badges?.length) {
        await db.collection('users').doc(userId).update({ badges });
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating faniq score:', error);
      return { success: false, error };
    }
  });

// Cloud Function to update club fans count
export const onUserFollowClub = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { clubId, action } = data;
  const userId = context.auth.uid;

  if (action === 'follow') {
    await db.collection('users').doc(userId).update({
      favoriteTeams: admin.firestore.FieldValue.arrayUnion(clubId)
    });
    await db.collection('clubs').doc(clubId).update({
      fansCount: admin.firestore.FieldValue.increment(1)
    });
  } else if (action === 'unfollow') {
    await db.collection('users').doc(userId).update({
      favoriteTeams: admin.firestore.FieldValue.arrayRemove(clubId)
    });
    await db.collection('clubs').doc(clubId).update({
      fansCount: admin.firestore.FieldValue.increment(-1)
    });
  }

  return { success: true };
});

// Cloud Function to update followers/following
export const onFollowUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { targetUserId, action } = data;
  const currentUserId = context.auth.uid;

  if (action === 'follow') {
    await db.collection('users').doc(currentUserId).update({
      following: admin.firestore.FieldValue.arrayUnion(targetUserId)
    });
    await db.collection('users').doc(targetUserId).update({
      followers: admin.firestore.FieldValue.arrayUnion(currentUserId)
    });
  } else if (action === 'unfollow') {
    await db.collection('users').doc(currentUserId).update({
      following: admin.firestore.FieldValue.arrayRemove(targetUserId)
    });
    await db.collection('users').doc(targetUserId).update({
      followers: admin.firestore.FieldValue.arrayRemove(currentUserId)
    });
  }

  return { success: true };
}));
