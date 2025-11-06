import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { HistoryItem } from '../app/(tabs)/tryonHistory'; // Import the type

const { width } = Dimensions.get('window');
const itemWidth = (width / 2) - 24; // 2 columns with some padding

interface WardrobeItemProps {
  item: HistoryItem;
}

const WardrobeItem: React.FC<WardrobeItemProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.result_image_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.brandText} numberOfLines={1}>
          {item.product_info.brand_name} - {item.product_info.product_name}
        </Text>
        <Text style={styles.priceText}>
          {item.product_info.currency}{Math.floor(item.product_info.price)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: itemWidth,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 10,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 12,
    color: '#666',
  },
});

export default WardrobeItem;
