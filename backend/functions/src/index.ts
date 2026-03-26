import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const db = admin.firestore()

/**
 * Triggered when a user creates a new trip.
 * Creates an automatic post in the feed.
 */
export const onTripCreated = functions.firestore
  .document('trips/{tripId}')
  .onCreate(async (snap, context) => {
    const trip = snap.data()
    const tripId = context.params.tripId

    // Create a post for the trip
    await db.collection('posts').add({
      userId: trip.userId,
      content: `¡Nuevo viaje creado a ${trip.destination}! 🌍⚽`,
      photos: trip.photos || [],
      likes: [],
      comments: [],
      type: 'trip',
      relatedId: tripId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // Update user's trips array
    await db.collection('users').doc(trip.userId).update({
      trips: admin.firestore.FieldValue.arrayUnion(tripId)
    })

    return null
  })

/**
 * Triggered when a user creates a new experience.
 * Creates an automatic post in the feed.
 */
export const onExperienceCreated = functions.firestore
  .document('experiences/{experienceId}')
  .onCreate(async (snap, context) => {
    const experience = snap.data()
    const experienceId = context.params.experienceId

    // Create a post for the experience
    await db.collection('posts').add({
      userId: experience.userId,
      content: `Nueva experiencia: ${experience.title} ✨`,
      photos: experience.photos || [],
      likes: [],
      comments: [],
      type: 'experience',
      relatedId: experienceId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // Update user's experiences array
    await db.collection('users').doc(experience.userId).update({
      experiences: admin.firestore.FieldValue.arrayUnion(experienceId)
    })

    return null
  })

/**
 * HTTP function to follow a user.
 */
export const followUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const { targetUserId } = data
  const currentUserId = context.auth.uid

  if (currentUserId === targetUserId) {
    throw new functions.https.HttpsError('invalid-argument', 'Cannot follow yourself')
  }

  const batch = db.batch()

  // Add target user to current user's following
  batch.update(db.collection('users').doc(currentUserId), {
    following: admin.firestore.FieldValue.arrayUnion(targetUserId)
  })

  // Add current user to target user's followers
  batch.update(db.collection('users').doc(targetUserId), {
    followers: admin.firestore.FieldValue.arrayUnion(currentUserId)
  })

  await batch.commit()

  return { success: true }
})

/**
 * HTTP function to unfollow a user.
 */
export const unfollowUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const { targetUserId } = data
  const currentUserId = context.auth.uid

  const batch = db.batch()

  // Remove target user from current user's following
  batch.update(db.collection('users').doc(currentUserId), {
    following: admin.firestore.FieldValue.arrayRemove(targetUserId)
  })

  // Remove current user from target user's followers
  batch.update(db.collection('users').doc(targetUserId), {
    followers: admin.firestore.FieldValue.arrayRemove(currentUserId)
  })

  await batch.commit()

  return { success: true }
})

/**
 * HTTP function to like a post.
 */
export const likePost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const { postId } = data
  const userId = context.auth.uid

  await db.collection('posts').doc(postId).update({
    likes: admin.firestore.FieldValue.arrayUnion(userId)
  })

  return { success: true }
})

/**
 * HTTP function to unlike a post.
 */
export const unlikePost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  const { postId } = data
  const userId = context.auth.uid

  await db.collection('posts').doc(postId).update({
    likes: admin.firestore.FieldValue.arrayRemove(userId)
  })

  return { success: true }
})

/**
 * Scheduled function to clean up old data (runs daily).
 */
export const dailyCleanup = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    // TODO: Implement cleanup logic
    console.log('Daily cleanup running...')
    return null
  })
