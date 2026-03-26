import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: '#00A86B',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
};

const TripsScreen = ({ navigation }: any) => {
  const trips = [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>✈️</Text>
      <Text style={styles.emptyTitle}>No hay viajes</Text>
      <Text style={styles.emptySubtitle}>Crea tu primer viaje para ver tus aventuras aquí</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateTrip')}>
        <Text style={styles.createButtonText}>Crear Viaje</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {trips.length === 0 ? renderEmptyState() : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tripCard} onPress={() => navigation.navigate('TripDetail', { id: item.id })}>
              <Text style={styles.tripTitle}>{item.title}</Text>
              <Text style={styles.tripLocation}>📍 {item.destinationCity}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tripCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  tripLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default TripsScreen;
