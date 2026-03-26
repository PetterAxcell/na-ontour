import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TripsScreen from './src/screens/TripsScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import CreateTripScreen from './src/screens/CreateTripScreen';
import ExperiencesScreen from './src/screens/ExperiencesScreen';
import ExperienceDetailScreen from './src/screens/ExperienceDetailScreen';
import CreateExperienceScreen from './src/screens/CreateExperienceScreen';
import ClubsScreen from './src/screens/ClubsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SocialScreen from './src/screens/SocialScreen';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Theme colors
const COLORS = {
  primary: '#00A86B',
  primaryDark: '#006B3C',
  accent: '#FF6B35',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Trips: '✈️',
    Experiences: '📸',
    Clubs: '⚽',
    Profile: '👤',
  };
  
  return (
    <View style={styles.tabIconContainer}>
      <Text style={{ fontSize: focused ? 26 : 22 }}>{icons[name] || '📌'}</Text>
    </View>
  );
};

// Main Tabs Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'NA-ONTOUR' }}
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen}
        options={{ title: 'Viajes' }}
      />
      <Tab.Screen 
        name="Experiences" 
        component={ExperiencesScreen}
        options={{ title: 'Experiencias' }}
      />
      <Tab.Screen 
        name="Clubs" 
        component={ClubsScreen}
        options={{ title: 'Clubes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Stack (with tabs)
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TripDetail" 
        component={TripDetailScreen}
        options={{ title: 'Detalle del Viaje' }}
      />
      <Stack.Screen 
        name="CreateTrip" 
        component={CreateTripScreen}
        options={{ title: 'Crear Viaje' }}
      />
      <Stack.Screen 
        name="ExperienceDetail" 
        component={ExperienceDetailScreen}
        options={{ title: 'Experiencia' }}
      />
      <Stack.Screen 
        name="CreateExperience" 
        component={CreateExperienceScreen}
        options={{ title: 'Nueva Experiencia' }}
      />
      <Stack.Screen 
        name="Social" 
        component={SocialScreen}
        options={{ title: 'Social' }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingLogo}>⚽</Text>
        <Text style={styles.loadingText}>NA-ONTOUR</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingLogo: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
