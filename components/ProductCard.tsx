import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export interface Product {
    name: string;
    newPrice: string;
    ogPrice?: string;
    currency: string;
    image: string;
    brand: string;
    url: string;
    isOnSale?: boolean;
}

interface ProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
}

import { useRouter } from 'expo-router';

export default function ProductCard({ product, onPress }: ProductCardProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress(product);
        } else {
            // Fallback navigation if no custom onPress provided
            router.push({
                pathname: "/(tabs)/homepage/detail",
                params: {
                    id: product.url, // Using URL as ID for now
                    name: product.name,
                    newPrice: product.newPrice,
                    image: product.image,
                    brand: product.brand,
                    currency: product.currency
                }
            });
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        {product.currency === 'USD' ? '$' : product.currency}{product.newPrice}
                    </Text>
                    {product.isOnSale && product.ogPrice && (
                        <Text style={styles.ogPrice}>
                            {product.currency === 'USD' ? '$' : product.currency}{product.ogPrice}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH * 1.3, // Aspect ratio for fashion items
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 12,
    },
    brand: {
        fontSize: 10,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
        fontWeight: '600',
    },
    name: {
        fontSize: 13,
        color: '#1a1a1a',
        marginBottom: 6,
        lineHeight: 18,
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    ogPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
});
