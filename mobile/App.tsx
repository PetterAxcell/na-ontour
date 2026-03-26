import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, getDocs } from 'firebase/firestore';

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:android:abc123'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Color palette
const COLORS = {
  primary: '#1A5F2A',
  primaryLight: '#2D8A42',
  secondary: '#F4A623',
  accent: '#E63946',
  bg: '#FFFFFF',
  surface: '#F8F9FA',
  border: '#DEE2E6',
  text: '#212529',
  textSecondary: '#6C757D',
};

interface UserData {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
  trips: string[];
  experiences: string[];
  clubs: string[];
  bio: string;
  faniqScore: number;
  badges: string[];
  following: string[];
  followers: string[];
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  photos: string[];
  likes: string[];
  commentsCount: number;
  type: 'post' | 'trip' | 'experience';
  createdAt: Date;
}

interface Trip {
  id: string;
  userId: string;
  destination: string;
  matchDate: Date;
  status: 'planning' | 'ongoing' | 'completed';
  photos: string[];
  description: string;
}

interface Experience {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: Date;
  type: 'match' | 'travel' | 'event' | 'personal';
  photos: string[];
}

interface Club {
  id: string;
  name: string;
  logo: string;
  stadium: string;
  country: string;
  fans: string[];
  description: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user data from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData({ id: userSnap.id, ...userSnap.data() } as UserData);
        } else {
          // Create user document if it doesn't exist
          await setDoc(userRef, {
            name: currentUser.displayName || 'Usuario NA-ONTOUR',
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            bio: '',
            homeCity: '',
            homeCountry: '',
            faniqScore: 0,
            badges: [],
            favoriteTeams: [],
            trips: [],
            experiences: [],
            following: [],
            followers: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setUserData({
            id: currentUser.uid,
            name: currentUser.displayName || 'Usuario NA-ONTOUR',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL,
            trips: [],
            experiences: [],
            clubs: [],
            bio: '',
            faniqScore: 0,
            badges: [],
            following: [],
            followers: []
          });
        }
        
        // Fetch posts
        fetchPosts();
        // Fetch user's trips
        fetchTrips(currentUser.uid);
        // Fetch user's experiences
        fetchExperiences(currentUser.uid);
      } else {
        setUserData(null);
        setPosts([]);
        setTrips([]);
        setExperiences([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Post[];
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchTrips = async (userId: string) => {
    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef);
      const snapshot = await getDocs(q);
      
      const fetchedTrips = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          matchDate: doc.data().matchDate?.toDate() || new Date()
        })) as Trip[];
      
      setTrips(fetchedTrips.filter(t => t.userId === userId));
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const fetchExperiences = async (userId: string) => {
    try {
      const expRef = collection(db, 'experiences');
      const q = query(expRef);
      const snapshot = await getDocs(q);
      
      const fetchedExp = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date()
        })) as Experience[];
      
      setExperiences(fetchedExp.filter(e => e.userId === userId));
    } catch (err) {
      console.error('Error fetching experiences:', err);
    }
  };

  const fetchClubs = async () => {
    try {
      const clubsRef = collection(db, 'clubs');
      const snapshot = await getDocs(clubsRef);
      
      const fetchedClubs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Club[];
      
      setClubs(fetchedClubs);
    } catch (err) {
      console.error('Error fetching clubs:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'clubs' && user) {
      fetchClubs();
    }
  }, [activeTab, user]);

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email: userCredential.user.email,
        photoURL: null,
        bio: '',
        homeCity: '',
        homeCountry: '',
        faniqScore: 0,
        badges: [],
        favoriteTeams: [],
        trips: [],
        experiences: [],
        following: [],
        followers: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogin(true);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Render Login Screen
  const renderLogin = () => (
    <View style={styles.loginContainer}>
      <Text style={styles.loginLogo}>🌍⚽</Text>
      <Text style={styles.loginTitle}>NA-ONTOUR</Text>
      <Text style={styles.loginSubtitle}>Vive el fútbol, más allá del partido</Text>
      
      <View style={styles.loginForm}>
        {!isLogin && (
          <TextInput 
            style={styles.loginInput}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput 
          style={styles.loginInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.loginInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={styles.loginBtn} 
          onPress={isLogin ? handleLogin : handleRegister}
        >
          <Text style={styles.loginBtnText}>
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.registerText}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Home Screen
  const renderHome = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.homeHeader}>
        <Text style={styles.logo}>🌍⚽ NA-ONTOUR</Text>
        <Text style={styles.greeting}>
          ¡Hola, {userData?.name || user?.displayName || 'Usuario'}! 👋
        </Text>
      </View>

      {/* Create Post */}
      <View style={styles.createPost}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarText}>
            {(userData?.name || user?.displayName || 'U')[0]}
          </Text>
        </View>
        <TextInput 
          style={styles.postInput}
          placeholder="¿Qué estás viviendo hoy?"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Feed */}
      <View style={styles.feed}>
        {posts.length === 0 ? (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyIcon}>⚽</Text>
            <Text style={styles.emptyTitle}>Tu feed está vacío</Text>
            <Text style={styles.emptyText}>
              Sigue a otros usuarios o crea tu primer viaje para ver contenido aquí.
            </Text>
          </View>
        ) : (
          posts.map(post => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarText}>
                    {(post.userName || 'U')[0]}
                  </Text>
                </View>
                <View style={styles.postMeta}>
                  <Text style={styles.postAuthor}>{post.userName || 'Usuario'}</Text>
                  <Text style={styles.postTime}>Ahora</Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.actionText}>{post.likes?.length || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  // Render Trips Screen
  const renderTrips = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Mis Viajes</Text>
        <TouchableOpacity style={styles.createBtn}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.createBtnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {['Todos', 'Planificando', 'En curso', 'Completados'].map((filter, idx) => (
          <TouchableOpacity 
            key={filter} 
            style={[styles.filterBtn, idx === 0 && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, idx === 0 && styles.filterTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tripsGrid}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✈️</Text>
            <Text style={styles.emptyTitle}>No hay viajes</Text>
            <Text style={styles.emptyText}>Crea tu primer viaje a un partido.</Text>
          </View>
        ) : (
          trips.map(trip => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripImagePlaceholder}>
                <Text style={styles.tripEmoji}>
                  {trip.status === 'completed' ? '✅' : trip.status === 'ongoing' ? '⚽' : '📋'}
                </Text>
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.tripDestination}>{trip.destination}</Text>
                <Text style={styles.tripDate}>
                  {trip.matchDate.toLocaleDateString()}
                </Text>
                <View style={[styles.tripStatus, trip.status === 'completed' && styles.tripStatusCompleted]}>
                  <Text style={styles.tripStatusText}>
                    {trip.status === 'completed' ? '✅' : '📋'} {trip.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  // Render Experiences Screen
  const renderExperiences = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Experiencias</Text>
        <TouchableOpacity style={styles.createBtn}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.createBtnText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.experienceGrid}>
        {experiences.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>No hay experiencias</Text>
            <Text style={styles.emptyText}>Captura tus mejores momentos.</Text>
          </View>
        ) : (
          experiences.map(exp => (
            <View key={exp.id} style={styles.expCard}>
              <View style={styles.expImagePlaceholder}>
                <Text style={styles.expEmoji}>
                  {exp.type === 'match' ? '⚽' : exp.type === 'travel' ? '✈️' : exp.type === 'event' ? '🎉' : '💭'}
                </Text>
              </View>
              <Text style={styles.expTitle}>{exp.title}</Text>
              <Text style={styles.expDate}>{exp.date.toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  // Render Clubs Screen
  const renderClubs = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Clubes</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar clubes..."
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <View style={styles.clubsList}>
        {clubs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏟️</Text>
            <Text style={styles.emptyTitle}>No hay clubes</Text>
            <Text style={styles.emptyText}>Los clubes aparecerán aquí.</Text>
          </View>
        ) : (
          clubs.map(club => (
            <View key={club.id} style={styles.clubCard}>
              <View style={styles.clubLogoPlaceholder}>
                <Text style={styles.clubEmoji}>⚽</Text>
              </View>
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubFans}>{club.fans?.length || 0} fans</Text>
              </View>
              <TouchableOpacity 
                style={[
                  styles.followBtn, 
                  followedClubs.includes(club.id) && styles.followBtnActive
                ]}
              >
                <Text style={[
                  styles.followBtnText, 
                  followedClubs.includes(club.id) && styles.followBtnTextActive
                ]}>
                  {followedClubs.includes(club.id) ? '✓ Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  // Render Profile Screen
  const renderProfile = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>
            {(userData?.name || user?.displayName || 'U')[0]}
          </Text>
        </View>
        <Text style={styles.profileName}>{userData?.name || user?.displayName || 'Usuario'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        {userData?.bio ? <Text style={styles.profileBio}>{userData.bio}</Text> : null}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData?.trips?.length || 0}</Text>
          <Text style={styles.statLabel}>Viajes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData?.experiences?.length || 0}</Text>
          <Text style={styles.statLabel}>Experiencias</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData?.followers?.length || 0}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="create-outline" size={22} color={COLORS.text} />
          <Text style={styles.menuText}>Editar perfil</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
          <Text style={styles.menuText}>Configuración</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.accent} />
          <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>🌍⚽</Text>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      );
    }
    
    if (showLogin || !user) return renderLogin();
    
    switch (activeTab) {
      case 'home': return renderHome();
      case 'trips': return renderTrips();
      case 'experiences': return renderExperiences();
      case 'clubs': return renderClubs();
      case 'profile': return renderProfile();
      default: return renderHome();
    }
  };

  // Tab bar
  const TabBar = () => {
    if (showLogin || !user) return null;
    
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Ionicons 
            name={activeTab === 'home' ? 'home' : 'home-outline'} 
            size={24} 
            color={activeTab === 'home' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('trips')}>
          <Ionicons 
            name={activeTab === 'trips' ? 'airplane' : 'airplane-outline'} 
            size={24} 
            color={activeTab === 'trips' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.tabTextActive]}>Viajes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('experiences')}>
          <Ionicons 
            name={activeTab === 'experiences' ? 'camera' : 'camera-outline'} 
            size={24} 
            color={activeTab === 'experiences' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'experiences' && styles.tabTextActive]}>Experiencias</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('clubs')}>
          <Ionicons 
            name={activeTab === 'clubs' ? 'people' : 'people-outline'} 
            size={24} 
            color={activeTab === 'clubs' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'clubs' && styles.tabTextActive]}>Clubes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Ionicons 
            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'profile' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {renderContent()}
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingLogo: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFF',
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Screens
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  // Home
  homeHeader: {
    paddingTop: 16,
    marginBottom: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  createPost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  postInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  
  // Feed
  feed: {
    paddingBottom: 16,
  },
  emptyFeed: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postMeta: {
    marginLeft: 12,
  },
  postAuthor: {
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.text,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    gap: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  
  // Create Button
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  createBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  
  // Trips
  tripsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  tripCard: {
    width: '47%',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tripImagePlaceholder: {
    height: 100,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripEmoji: {
    fontSize: 32,
  },
  tripInfo: {
    padding: 12,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  tripDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tripStatus: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tripStatusCompleted: {
    backgroundColor: COLORS.primary,
  },
  tripStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: COLORS.text,
  },
  
  // Experiences
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  expCard: {
    width: '47%',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  expImagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expEmoji: {
    fontSize: 40,
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    padding: 12,
    paddingBottom: 4,
  },
  expDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  
  // Clubs
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  clubsList: {
    paddingBottom: 16,
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  clubLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubEmoji: {
    fontSize: 24,
  },
  clubInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  clubFans: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  followBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followBtnActive: {
    backgroundColor: COLORS.primary,
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  followBtnTextActive: {
    color: '#FFF',
  },
  
  // Profile
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileBio: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: COLORS.accent,
  },
  
  // Login
  loginContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loginLogo: {
    fontSize: 64,
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 48,
    textAlign: 'center',
  },
  loginForm: {
    width: '100%',
  },
  loginInput: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: COLORS.text,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  registerBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
