import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: '#00A86B',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
};

const ExperiencesScreen = ({ navigation }: any) => {
  const experiences = [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📸</Text>
      <Text style={styles.emptyTitle}>No hay experiencias</Text>
      <Text style={styles.emptySubtitle}>Captura tus mejores momentos como aficionado</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateExperience')}>
        <Text style={styles.createButtonText}>Crear Experiencia</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {experiences.length === 0 ? renderEmptyState() : (
        <FlatList data={experiences} keyExtractor={(item) => item.id} renderItem={({ item }) => (
          <TouchableOpacity style={styles.expCard} onPress={() => navigation.navigate('ExperienceDetail', { id: item.id })}>
            <Text style={styles.expTitle}>{item.title}</Text>
          </TouchableOpacity>
        )} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  createButton: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  createButtonText: { color: '#fff', fontWeight: 'bold' },
  expCard: { backgroundColor: COLORS.surface, margin: 16, marginBottom: 0, padding: 16, borderRadius: 12 },
  expTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
});

export default ExperiencesScreen;
