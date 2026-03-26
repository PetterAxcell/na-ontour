import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const COLORS = {
  primary: '#00A86B',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
};

const CreateTripScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destinationCity: '',
    destinationCountry: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Título del viaje</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(v) => handleChange('title', v)}
          placeholder="Ej: Viaje al Bernabéu"
        />

        <Text style={styles.label}>Ciudad destino</Text>
        <TextInput
          style={styles.input}
          value={formData.destinationCity}
          onChangeText={(v) => handleChange('destinationCity', v)}
          placeholder="Madrid"
        />

        <Text style={styles.label}>País destino</Text>
        <TextInput
          style={styles.input}
          value={formData.destinationCountry}
          onChangeText={(v) => handleChange('destinationCountry', v)}
          placeholder="España"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Fecha inicio</Text>
            <TextInput style={styles.input} value={formData.startDate} onChangeText={(v) => handleChange('startDate', v)} placeholder="YYYY-MM-DD" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Fecha fin</Text>
            <TextInput style={styles.input} value={formData.endDate} onChangeText={(v) => handleChange('endDate', v)} placeholder="YYYY-MM-DD" />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Crear Viaje</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: { backgroundColor: COLORS.surface, borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  button: { backgroundColor: COLORS.primary, borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CreateTripScreen;
