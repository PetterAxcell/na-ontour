import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const COLORS = { primary: '#00A86B', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#6B6B6B' };

const CreateExperienceScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({ title: '', description: '', type: 'sightseeing', city: '', tags: '' });

  const handleChange = (field: string, value: string) => setFormData({ ...formData, [field]: value });
  const handleSubmit = () => navigation.goBack();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={formData.title} onChangeText={(v) => handleChange('title', v)} placeholder="Ej: Partido en el Bernabéu" />
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeSelector}>
          {['⚽ Partido', '📸 Visita', '🍽️ Comida', '🏨 Alojamiento'].map((t) => (
            <TouchableOpacity key={t} style={[styles.typeButton, formData.type === t && styles.typeButtonActive]} onPress={() => handleChange('type', t)}>
              <Text style={styles.typeButtonText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Ciudad</Text>
        <TextInput style={styles.input} value={formData.city} onChangeText={(v) => handleChange('city', v)} placeholder="Madrid" />
        <Text style={styles.label}>Descripción</Text>
        <TextInput style={[styles.input, { height: 100 }]} value={formData.description} onChangeText={(v) => handleChange('description', v)} placeholder="Cuéntanos tu experiencia..." multiline />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Crear Experiencia</Text>
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
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: '#E0E0E0' },
  typeButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeButtonText: { color: COLORS.text, fontSize: 14 },
  button: { backgroundColor: COLORS.primary, borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CreateExperienceScreen;
