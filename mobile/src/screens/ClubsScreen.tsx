import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

const COLORS = { primary: '#00A86B', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#6B6B6B' };

const clubsData = [
  { id: '1', name: 'Real Madrid', shortName: 'RMA', city: 'Madrid', country: 'España' },
  { id: '2', name: 'FC Barcelona', shortName: 'FCB', city: 'Barcelona', country: 'España' },
  { id: '3', name: 'Manchester United', shortName: 'MUN', city: 'Manchester', country: 'Inglaterra' },
  { id: '4', name: 'Bayern München', shortName: 'BAY', city: 'Munich', country: 'Alemania' },
  { id: '5', name: 'Juventus', shortName: 'JUV', city: 'Turín', country: 'Italia' },
  { id: '6', name: 'Liverpool', shortName: 'LIV', city: 'Liverpool', country: 'Inglaterra' },
];

const ClubsScreen = () => {
  const [search, setSearch] = React.useState('');

  const filteredClubs = clubsData.filter(club => 
    club.name.toLowerCase().includes(search.toLowerCase()) || 
    club.shortName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Buscar clubes..." placeholderTextColor={COLORS.textSecondary} />
      </View>
      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.clubCard}>
            <View style={styles.clubIcon}>
              <Text style={{ fontSize: 32 }}>⚽</Text>
            </View>
            <Text style={styles.clubName}>{item.shortName}</Text>
            <Text style={styles.clubCity}>{item.city}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: { padding: 16 },
  searchInput: { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  listContent: { padding: 8 },
  clubCard: { flex: 1, backgroundColor: COLORS.surface, margin: 8, padding: 16, borderRadius: 12, alignItems: 'center' },
  clubIcon: { width: 60, height: 60, backgroundColor: '#F5F5F5', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  clubName: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  clubCity: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
});

export default ClubsScreen;
