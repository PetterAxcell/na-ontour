import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, FlatList, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';

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

// Mock data
const MOCK_USER = {
  name: 'Usuario NA-ONTOUR',
  email: 'usuario@ejemplo.com',
  trips: 5,
  experiences: 12,
  clubs: 3,
};

const MOCK_POSTS = [
  { id: '1', user: 'FanTotal', content: '¡Qué partido increíble! ⚽', likes: 24, comments: 5, time: '2h' },
  { id: '2', user: 'ViajeFutbol', content: 'Preparando el viaje al derbi 🏟️', likes: 18, comments: 3, time: '4h' },
];

const MOCK_TRIPS = [
  { id: '1', destination: 'Madrid', date: '15 Mar 2024', status: 'completed', emoji: '✅' },
  { id: '2', destination: 'Barcelona', date: '22 Mar 2024', status: 'planning', emoji: '📋' },
];

const MOCK_EXPERIENCES = [
  { id: '1', title: 'Derbi Madrileño', date: '10 Mar 2024', type: 'match', emoji: '⚽' },
  { id: '2', title: 'Viaje a Bilbao', date: '5 Feb 2024', type: 'travel', emoji: '✈️' },
];

const MOCK_CLUBS = [
  { id: '1', name: 'Real Madrid', fans: 1250, followed: true },
  { id: '2', name: 'FC Barcelona', fans: 1180, followed: false },
  { id: '3', name: 'Atlético Madrid', fans: 890, followed: true },
];

// Navigation icons
const icons = {
  home: 'home',
  homeOutline: 'home-outline',
  plane: 'airplane',
  camera: 'camera',
  users: 'people',
  user: 'person',
  settings: 'settings-outline',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Render Home Screen
  const renderHome = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.homeHeader}>
        <Text style={styles.logo}>🌍⚽ NA-ONTOUR</Text>
        <Text style={styles.greeting}>¡Hola, {MOCK_USER.name}! 👋</Text>
      </View>

      {/* Create Post */}
      <View style={styles.createPost}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarText}>{MOCK_USER.name[0]}</Text>
        </View>
        <TextInput 
          style={styles.postInput}
          placeholder="¿Qué estás viviendo hoy?"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Feed */}
      <View style={styles.feed}>
        {MOCK_POSTS.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarText}>{post.user[0]}</Text>
              </View>
              <View style={styles.postMeta}>
                <Text style={styles.postAuthor}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="paper-plane-outline" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
        {MOCK_TRIPS.map(trip => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripImagePlaceholder}>
              <Text style={styles.tripEmoji}>{trip.emoji}</Text>
            </View>
            <View style={styles.tripInfo}>
              <Text style={styles.tripDestination}>{trip.destination}</Text>
              <Text style={styles.tripDate}>{trip.date}</Text>
              <View style={[styles.tripStatus, trip.status === 'completed' && styles.tripStatusCompleted]}>
                <Text style={styles.tripStatusText}>
                  {trip.status === 'completed' ? '✅' : '📋'} {trip.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
        {MOCK_EXPERIENCES.map(exp => (
          <View key={exp.id} style={styles.expCard}>
            <View style={styles.expImagePlaceholder}>
              <Text style={styles.expEmoji}>{exp.emoji}</Text>
            </View>
            <Text style={styles.expTitle}>{exp.title}</Text>
            <Text style={styles.expDate}>{exp.date}</Text>
          </View>
        ))}
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
        {MOCK_CLUBS.map(club => (
          <View key={club.id} style={styles.clubCard}>
            <View style={styles.clubLogoPlaceholder}>
              <Text style={styles.clubEmoji}>⚽</Text>
            </View>
            <View style={styles.clubInfo}>
              <Text style={styles.clubName}>{club.name}</Text>
              <Text style={styles.clubFans}>{club.fans} fans</Text>
            </View>
            <TouchableOpacity style={[styles.followBtn, club.followed && styles.followBtnActive]}>
              <Text style={[styles.followBtnText, club.followed && styles.followBtnTextActive]}>
                {club.followed ? '✓ Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Render Profile Screen
  const renderProfile = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{MOCK_USER.name[0]}</Text>
        </View>
        <Text style={styles.profileName}>{MOCK_USER.name}</Text>
        <Text style={styles.profileEmail}>{MOCK_USER.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_USER.trips}</Text>
          <Text style={styles.statLabel}>Viajes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_USER.experiences}</Text>
          <Text style={styles.statLabel}>Experiencias</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_USER.clubs}</Text>
          <Text style={styles.statLabel}>Clubes</Text>
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
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.accent} />
          <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Login Screen
  const renderLogin = () => (
    <View style={styles.loginContainer}>
      <Text style={styles.loginLogo}>🌍⚽</Text>
      <Text style={styles.loginTitle}>NA-ONTOUR</Text>
      <Text style={styles.loginSubtitle}>Vive el fútbol, más allá del partido</Text>
      
      <View style={styles.loginForm}>
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
        
        <TouchableOpacity style={styles.loginBtn} onPress={() => setShowLogin(false)}>
          <Text style={styles.loginBtnText}>Iniciar sesión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerBtn}>
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render content based on active tab
  const renderContent = () => {
    if (showLogin) return renderLogin();
    
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
    if (showLogin) return null;
    
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Ionicons 
            name={activeTab === 'home' ? icons.home as any : icons.homeOutline as any} 
            size={24} 
            color={activeTab === 'home' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('trips')}>
          <Ionicons 
            name={activeTab === 'trips' ? icons.plane as any : 'airplane-outline'} 
            size={24} 
            color={activeTab === 'trips' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.tabTextActive]}>Viajes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('experiences')}>
          <Ionicons 
            name={activeTab === 'experiences' ? icons.camera as any : 'camera-outline'} 
            size={24} 
            color={activeTab === 'experiences' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'experiences' && styles.tabTextActive]}>Experiencias</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('clubs')}>
          <Ionicons 
            name={activeTab === 'clubs' ? icons.users as any : 'people-outline'} 
            size={24} 
            color={activeTab === 'clubs' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'clubs' && styles.tabTextActive]}>Clubes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Ionicons 
            name={activeTab === 'profile' ? icons.user as any : 'person-outline'} 
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
});
