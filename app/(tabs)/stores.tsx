
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../utils/APIENDPOINTS';

type Store = {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
};

export default function StoresScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/stores`)
      .then(res => res.json())
      .then(data => {
        setStores(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load stores');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFC107" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nearby Stores</Text>
      <FlatList
        data={stores}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="location-outline" size={24} color="#FFC107" />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}, {item.city}, {item.state} - {item.pincode}</Text>
              {item.phone && <Text style={styles.phone}>Phone: {item.phone}</Text>}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No stores found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 12 },
  info: { marginLeft: 12 },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  address: { fontSize: 14, color: '#666', marginTop: 4 },
  phone: { fontSize: 14, color: '#666', marginTop: 2 },
  error: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 40 },
  empty: { color: '#666', fontSize: 16, textAlign: 'center', marginTop: 40 },
});
