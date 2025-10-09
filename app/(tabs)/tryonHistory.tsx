import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Make sure path is correct
import WardrobeItem from '../../components/WardrobeItems'; // We will create this next

// Define a type for a single item from your API
export interface HistoryItem {
  record_id: string;
  result_image_url: string;
  timestamp: string;
  product_info: {
    brand_name: string;
    product_name: string;
    price: number;
    currency: string;
  };
}

export default function WardrobeScreen() {
  const { userId } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for sorting
  const [sortOption, setSortOption] = useState('Most Recent'); // 'Most Recent', 'Price: Low to High', etc.
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setLoading(false);
        setError("User not logged in.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`https://tryon-history.faishion.ai/history?user_id=${userId}`);
        // Ensure response.data is an array
        const dataArray = Array.isArray(response.data) ? response.data : [];
        setItems(dataArray);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch wardrobe history:", e);
        setError("Failed to load your wardrobe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  // Sort the items based on the selected option
  const sortedItems = useMemo(() => {
    const sorted = [...items]; // Create a copy to avoid mutating state
    switch (sortOption) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => a.product_info.price - b.product_info.price);
      case 'Price: High to Low':
        return sorted.sort((a, b) => b.product_info.price - a.product_info.price);
      case 'Brand Name':
        return sorted.sort((a, b) => a.product_info.brand_name.localeCompare(b.product_info.brand_name));
      case 'Most Recent':
      default:
        return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }, [items, sortOption]);

  const renderSortOptions = () => {
    const options = ['Most Recent', 'Brand Name', 'Price: Low to High', 'Price: High to Low'];
    return (
      <View style={styles.sortDropdown}>
        {options.map(option => (
          <TouchableOpacity 
            key={option} 
            style={styles.sortOption} 
            onPress={() => {
              setSortOption(option);
              setShowSortOptions(false);
            }}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#6366f1" /></View>;
  }

  if (error) {
    return <View style={styles.centerContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header with Search and Filter */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
            <Text style={styles.searchText}>Search for an item</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)}>
            {/* Filter Icon placeholder */}
            <View style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Conditionally render sort options */}
      {showSortOptions && renderSortOptions()}

      <FlatList
        data={sortedItems}
        renderItem={({ item }) => <WardrobeItem item={item} />}
        keyExtractor={(item) => item.record_id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchBar: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', paddingLeft: 15, marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  searchText: { color: '#aaa' },
  filterIcon: { width: 24, height: 24, backgroundColor: '#ccc' }, // Placeholder
  sortDropdown: { position: 'absolute', top: 70, right: 15, backgroundColor: 'white', borderRadius: 8, padding: 10, zIndex: 1, borderWidth: 1, borderColor: '#ddd', elevation: 5 },
  sortOption: { paddingVertical: 8 },
  listContainer: { paddingHorizontal: 8, paddingTop: 8 },
});
