import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  primary: '#00A86B',
  primaryDark: '#006B3C',
  accent: '#FF6B35',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
};

const HomeScreen = ({ navigation }: any) => {
  const { user, userData } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {userData?.displayName || 'Aficionado'}! 👋</Text>
          <Text style={styles.subtitle}>¿A dónde te lleva tu pasión hoy?</Text>
        </View>
      </View>

      {/* Faniq Score Card */}
      <View style={styles.scoreCard}>
        <View>
          <Text style={styles.scoreLabel}>Tu Faniq Score</Text>
          <Text style={styles.scoreValue}>{userData?.faniqScore || 0} pts</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>⭐ Aficionado</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: '#E3F2FD' }]}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Text style={styles.quickActionIcon}>✈️</Text>
            <Text style={[styles.quickActionText, { color: '#1976D2' }]}>Nuevo Viaje</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: '#FFF3E0' }]}
            onPress={() => navigation.navigate('CreateExperience')}
          >
            <Text style={styles.quickActionIcon}>📸</Text>
            <Text style={[styles.quickActionText, { color: '#F57C00' }]}>Experiencia</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: '#E8F5E9' }]}
            onPress={() => navigation.navigate('Social')}
          >
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={[styles.quickActionText, { color: '#388E3C' }]}>Social</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu actividad</Text>
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
        </View>
      </View>

      {/* Upcoming Trip Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximo viaje</Text>
        <TouchableOpacity style={styles.emptyCard}>
          <Text style={styles.emptyCardIcon}>✈️</Text>
          <Text style={styles.emptyCardTitle}>No tienes viajes próximos</Text>
          <Text style={styles.emptyCardSubtitle}>¡Planifica tu próxima aventura!</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Text style={styles.createButtonText}>Crear viaje</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Popular Clubs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipos populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Real Madrid', 'Barcelona', 'Bayern', 'Liverpool', 'Juventus'].map((club, index) => (
            <TouchableOpacity key={index} style={styles.clubItem}>
              <View style={styles.clubIcon}>
                <Text style={{ fontSize: 24 }}>⚽</Text>
              </View>
              <Text style={styles.clubName}>{club}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyCardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyCardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clubItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  clubIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  clubName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
});

export default HomeScreen;
