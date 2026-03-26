import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const COLORS = { primary: '#00A86B', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#6B6B6B', accent: '#FF6B35' };

const SocialScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Feed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📰 Feed</Text>
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyIcon}>📰</Text>
            <Text style={styles.emptyTitle}>No hay actividad</Text>
            <Text style={styles.emptySubtitle}>¡Sé el primero en compartir!</Text>
          </View>
        </View>

        {/* Discover Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Descubrir</Text>
          
          {/* Suggested Users */}
          <Text style={styles.subsectionTitle}>Usuarios sugeridos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.usersScroll}>
            {['Fani1', 'Ultras2', 'Turista3', 'Hooligan4'].map((name, index) => (
              <View key={index} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={{ fontSize: 24 }}>👤</Text>
                </View>
                <Text style={styles.userName}>{name}</Text>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Seguir</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Trending */}
          <Text style={styles.subsectionTitle}>📈 Trending</Text>
          {['#ElClasico', '#UCL', '#PremierLeague', '#LaLiga'].map((tag, index) => (
            <View key={index} style={styles.trendingItem}>
              <Text style={styles.trendingTag}>{tag}</Text>
              <Text style={styles.trendingCount}>{Math.floor(Math.random() * 500 + 100)} posts</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  subsectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 12, marginTop: 8 },
  emptyFeed: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 32, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  usersScroll: { marginBottom: 16 },
  userCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center', marginRight: 12, minWidth: 100 },
  userAvatar: { width: 50, height: 50, backgroundColor: '#F5F5F5', borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  userName: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  followButton: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8 },
  followButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  trendingItem: { backgroundColor: COLORS.surface, padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  trendingTag: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  trendingCount: { fontSize: 12, color: COLORS.textSecondary },
});

export default SocialScreen;
