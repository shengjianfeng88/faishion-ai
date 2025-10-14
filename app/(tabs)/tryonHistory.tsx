import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import WardrobeItem from '../../components/WardrobeItems';

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
  const [sortOption, setSortOption] = useState('Most Recent');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        console.log("❌ No userId found");
        setLoading(false);
        setError("User not logged in.");
        return;
      }
      
      try {
        console.log("🔍 Fetching Try On History");
        console.log("📧 User ID:", userId);
        console.log("🔗 API URL:", `https://tryon-history.faishion.ai/history?user_id=${userId}`);
        
        setLoading(true);
        const response = await axios.get(`https://tryon-history.faishion.ai/history?user_id=${userId}`);
        
        console.log("✅ Response received");
        console.log("📦 Response status:", response.status);
        console.log("📦 Response data:", response.data);
        console.log("📊 Data type:", typeof response.data);
        console.log("📊 Is array:", Array.isArray(response.data));
        
        // Handle nested data structure - API returns {data: [...]}
        const responseData = response.data.data || response.data;
        console.log("📦 Extracted data:", responseData);
        console.log("📊 Extracted is array:", Array.isArray(responseData));
        console.log("📊 Extracted length:", Array.isArray(responseData) ? responseData.length : 'not an array');
        
        const dataArray = Array.isArray(responseData) ? responseData : [];
        console.log("📦 Setting items:", dataArray.length, "items");
        
        if (dataArray.length > 0) {
          console.log("📋 Sample item structure:", JSON.stringify(dataArray[0], null, 2));
        }
        
        // Transform API data to match HistoryItem interface
        const transformedData = dataArray.map((item: any, index: number) => ({
          record_id: item.productInfo?.product_url || `item-${index}`,
          result_image_url: item.tryOnImages?.[0] || '',
          timestamp: item.latestTryOnDate || new Date().toISOString(),
          product_info: {
            brand_name: item.productInfo?.brand_name || 'Unknown Brand',
            product_name: item.productInfo?.product_name || 'Unknown Product',
            price: item.productInfo?.price || 0,
            currency: item.productInfo?.currency || '$'
          }
        }));

        console.log("✅ Transformed data ready:", transformedData.length, "items");
        
        setItems(transformedData);
        setError(null);
      } catch (e: any) {
        console.error("❌ Failed to fetch wardrobe history");
        console.error("❌ Error message:", e.message);
        console.error("❌ Error response:", e.response?.data);
        console.error("❌ Error status:", e.response?.status);
        console.error("❌ Full error:", e);
        setError("Failed to load your wardrobe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const sortedItems = useMemo(() => {
    const sorted = [...items];
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
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading your wardrobe...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No try-on history yet</Text>
        <Text style={styles.emptySubtext}>Your try-on history will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Search for an item</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)}>
          <View style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

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
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  errorText: { 
    color: '#dc2626', 
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center'
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  searchBar: { 
    flex: 1, 
    height: 40, 
    backgroundColor: '#f3f4f6', 
    borderRadius: 8, 
    justifyContent: 'center', 
    paddingLeft: 15, 
    marginRight: 10
  },
  searchText: { 
    color: '#9ca3af',
    fontSize: 14
  },
  filterIcon: { 
    width: 24, 
    height: 24, 
    backgroundColor: '#d1d5db',
    borderRadius: 4
  },
  sortDropdown: { 
    position: 'absolute', 
    top: 70, 
    right: 15, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    padding: 10, 
    zIndex: 1, 
    borderWidth: 1, 
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  sortOption: { 
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  listContainer: { 
    paddingHorizontal: 8, 
    paddingTop: 8,
    paddingBottom: 20
  },
});
