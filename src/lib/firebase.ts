import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Helper to fetch user role from Firestore
export const getUserRoleFromFirestore = async (user: FirebaseUser): Promise<'user' | 'admin'> => {
  if (!user || user.isAnonymous) return 'user';

  if (user.email && (user.email.toLowerCase().includes('admin') || user.email.toLowerCase() === 'vishwaceo67@gmail.com')) {
    return 'admin';
  }

  try {
    const { getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.role === 'admin') {
        return 'admin';
      }
    }
  } catch (err) {
    console.warn('Error fetching user role from Firestore:', err);
  }

  return 'user';
};

// Helper to handle Auth user profile in Firestore
export const syncUserProfileInFirestore = async (user: FirebaseUser, role: 'user' | 'admin' = 'user') => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const { getDoc, setDoc } = await import('firebase/firestore');
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || 'anonymous@ecoclassify.org',
        role: role,
        scansCount: 0,
        feedbackCount: 0,
        ecoPoints: 0,
        ecoRankLevel: 1,
        createdAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        uid: user.uid,
        email: user.email || 'anonymous@ecoclassify.org',
        role: role,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Error syncing user profile in Firestore:', err);
  }
};

// Increment User Eco Points & Stats in Firestore
export const incrementUserEcoStats = async (userId: string, scanAdded = false, feedbackAdded = false) => {
  if (!userId) return;
  try {
    const { getDoc, setDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    
    let currentScans = 0;
    let currentFeedback = 0;

    if (snap.exists()) {
      const data = snap.data();
      currentScans = data.scansCount || 0;
      currentFeedback = data.feedbackCount || 0;
    }

    if (scanAdded) currentScans += 1;
    if (feedbackAdded) currentFeedback += 1;

    const newPoints = (currentScans * 10) + (currentFeedback * 15);
    const { calculateEcoRank } = await import('./ecoRanks');
    const rankInfo = calculateEcoRank(newPoints);

    if (snap.exists()) {
      await updateDoc(userRef, {
        scansCount: currentScans,
        feedbackCount: currentFeedback,
        ecoPoints: newPoints,
        ecoRankLevel: rankInfo.level,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await setDoc(userRef, {
        uid: userId,
        scansCount: currentScans,
        feedbackCount: currentFeedback,
        ecoPoints: newPoints,
        ecoRankLevel: rankInfo.level,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn('Failed to increment user eco stats in Firestore:', e);
  }
};

// Sign Up with Email/Password
export const signUpWithEmail = async (email: string, pass: string, role: 'user' | 'admin' = 'user') => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await syncUserProfileInFirestore(cred.user, role);
  return cred.user;
};

// Sign In with Email/Password
export const signInWithEmail = async (email: string, pass: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
};

// Sign Out
export const signOutUser = async () => {
  await signOut(auth);
};

// Helper for auth state initialization
export const initAuth = () => {
  return new Promise<FirebaseUser | null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user))
          .catch((err) => {
            console.warn('Anonymous auth is not enabled on this Firebase project or restricted:', err?.message || err);
            resolve(null);
          });
      }
    });
  });
};

// --- Firestore Database Services ---

// 1. Save scan entry to Firestore and update user stats
export const saveScanToFirestore = async (scanData: {
  userId?: string;
  userEmail?: string;
  itemName: string;
  predictedCategory: string;
  confidence: number;
  region: string;
  imageBase64?: string;
  description?: string;
}) => {
  try {
    const scansRef = collection(db, 'scans');
    const docRef = await addDoc(scansRef, {
      ...scanData,
      feedbackSubmitted: false,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    });

    if (scanData.userId) {
      await incrementUserEcoStats(scanData.userId, true, false);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error saving scan to Firestore:', error);
    return null;
  }
};

// 2. Submit User Feedback Annotation (RLHF) to Firestore
export const submitFeedbackToFirestore = async (feedbackData: {
  scanId?: string;
  userId?: string;
  userEmail?: string;
  originalCategory: string;
  correctedCategory: string;
  itemName: string;
  imageBase64?: string;
  isCorrect: boolean;
  comments?: string;
}) => {
  try {
    const feedbackRef = collection(db, 'user_feedback');
    const docRef = await addDoc(feedbackRef, {
      ...feedbackData,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    });

    // Update scan status if scanId is provided
    if (feedbackData.scanId) {
      try {
        const scanDoc = doc(db, 'scans', feedbackData.scanId);
        await updateDoc(scanDoc, {
          feedbackSubmitted: true,
          correctedCategory: feedbackData.correctedCategory,
        });
      } catch (e) {
        console.warn('Could not update original scan document status');
      }
    }

    if (feedbackData.userId) {
      await incrementUserEcoStats(feedbackData.userId, false, true);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error submitting feedback to Firestore:', error);
    return null;
  }
};

// 2b. Fetch User Scans for Dashboard
export const fetchUserScansFromFirestore = async (userId: string) => {
  if (!userId) return [];
  try {
    const scansRef = collection(db, 'scans');
    const q = query(scansRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const scans: any[] = [];
    querySnapshot.forEach((doc) => {
      scans.push({ id: doc.id, ...doc.data() });
    });
    return scans;
  } catch (error) {
    console.error('Error fetching user scans from Firestore:', error);
    return [];
  }
};

// 2c. Fetch User Feedback for Dashboard
export const fetchUserFeedbackFromFirestore = async (userId: string) => {
  if (!userId) return [];
  try {
    const feedbackRef = collection(db, 'user_feedback');
    const q = query(feedbackRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list;
  } catch (error) {
    console.error('Error fetching user feedback from Firestore:', error);
    return [];
  }
};

// 3. Fetch all feedback items for Admin Feedback Dashboard
export const fetchAllFeedbackFromFirestore = async () => {
  try {
    const feedbackRef = collection(db, 'user_feedback');
    const q = query(feedbackRef, orderBy('createdAt', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    const feedbackList: any[] = [];
    querySnapshot.forEach((doc) => {
      feedbackList.push({ id: doc.id, ...doc.data() });
    });
    return feedbackList;
  } catch (error) {
    console.error('Error fetching feedback from Firestore:', error);
    return [];
  }
};

// 4. Update Feedback status (Admin approve/reject)
export const updateFeedbackStatusInFirestore = async (
  feedbackId: string,
  newStatus: 'Approved for Dataset' | 'Ingested' | 'Rejected'
) => {
  try {
    const feedbackDoc = doc(db, 'user_feedback', feedbackId);
    await updateDoc(feedbackDoc, { status: newStatus });
    return true;
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return false;
  }
};

// 5. Save Custom Uploaded Dataset metadata & samples to Firestore
export const saveCustomDatasetToFirestore = async (dataset: {
  name: string;
  uploadedBy: string;
  samplesCount: number;
  classesCount: number;
  description: string;
  categories: string[];
  samples?: Array<{ name: string; category: string; imageBase64?: string }>;
}) => {
  try {
    const datasetsRef = collection(db, 'custom_datasets');
    const docRef = await addDoc(datasetsRef, {
      ...dataset,
      status: 'Ready for Training',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving custom dataset to Firestore:', error);
    return null;
  }
};

// 6. Fetch Custom Datasets from Firestore
export const fetchCustomDatasetsFromFirestore = async () => {
  try {
    const datasetsRef = collection(db, 'custom_datasets');
    const querySnapshot = await getDocs(datasetsRef);
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list;
  } catch (error) {
    console.error('Error fetching custom datasets from Firestore:', error);
    return [];
  }
};

// 7. Gather ALL User Images & Feedback Annotations + Uploaded Datasets for Retraining
export const gatherAllTrainingDataFromFirestore = async () => {
  try {
    // 1. Get all feedback annotations (both correct & corrected)
    const feedbackList = await fetchAllFeedbackFromFirestore();
    
    // 2. Get all uploaded custom datasets
    const customDatasets = await fetchCustomDatasetsFromFirestore();

    // 3. Get raw user scans
    const scansRef = collection(db, 'scans');
    const scansSnapshot = await getDocs(query(scansRef, limit(100)));
    const scansList: any[] = [];
    scansSnapshot.forEach((doc) => {
      scansList.push({ id: doc.id, ...doc.data() });
    });

    const totalUserScans = scansList.length;
    const totalUserFeedback = feedbackList.length;

    let totalCustomSamples = 0;
    customDatasets.forEach((ds) => {
      totalCustomSamples += ds.samplesCount || 0;
    });

    return {
      totalUserScans,
      totalUserFeedback,
      totalCustomSamples,
      grandTotalImages: totalUserScans + totalUserFeedback + totalCustomSamples,
      feedbackList,
      customDatasets,
      scansList,
    };
  } catch (error) {
    console.error('Error gathering training data from Firestore:', error);
    return {
      totalUserScans: 0,
      totalUserFeedback: 0,
      totalCustomSamples: 0,
      grandTotalImages: 0,
      feedbackList: [],
      customDatasets: [],
      scansList: [],
    };
  }
};
