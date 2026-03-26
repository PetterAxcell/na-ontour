import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = { primary: '#00A86B', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#6B6B6B' };

const ProfileScreen = ({ navigation }: any) => {
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    if (navigation) {
      await logout();
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userData?.displayName?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{userData?.displayName || 'Usuario'}</Text>
        <Text style={styles.username}>@{userData?.username || 'username'}</Text>
        {userData?.bio && <Text style={styles.bio}>{userData.bio}</Text>}
        
        {/* Faniq Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Faniq Score</Text>
          <Text style={styles.scoreValue}>{userData?.faniqScore || 0}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Viajes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Experiencias</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData?.followers?.length || 0}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData?.following?.length || 0}</Text>
          <Text style={styles.statLabel}>Siguiendo</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>✏️</Text>
          <Text style={styles.menuText}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Configuración</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, padding: 24, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  username: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  bio: { fontSize: 14, color: COLORS.text, marginTop: 12, textAlign: 'center' },
  scoreCard: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, marginTop: 16 },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  scoreValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, paddingVertical: 16, marginTop: 8 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  menu: { backgroundColor: COLORS.surface, marginTop: 8, paddingVertical: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { fontSize: 20, marginRight: 16 },
  menuText: { fontSize: 16, color: COLORS.text },
  logoutItem: { borderTopWidth: 1, borderTopColor: '#E0E0E0', marginTop: 8 },
  logoutText: { color: '#F44336' },
});

export default ProfileScreen;
