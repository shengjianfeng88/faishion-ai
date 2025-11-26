import Toast from '@/components/Toast';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function ProductDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isInCloset, setIsInCloset] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Parse params (handling potential string/array types)
    const product = {
        name: params.name as string,
        newPrice: params.newPrice as string,
        image: params.image as string,
        brand: params.brand as string,
        currency: params.currency as string,
    };

    const handleAddToCloset = () => {
        setIsInCloset(!isInCloset);
        if (!isInCloset) {
            setShowToast(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

                    {/* More Options Button */}
                    <TouchableOpacity
                        style={styles.moreOptionsButton}
                        onPress={() => setShowFeedbackModal(true)}
                    >
                        <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.brand}>{product.brand}</Text>
                    <View style={styles.titleRow}>
                        <Text style={styles.name}>{product.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#6A5ACD" />
                    </View>
                    <Text style={styles.price}>
                        {product.currency === 'USD' ? '$' : product.currency}{product.newPrice}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.tryOnButton}>
                            <MaterialCommunityIcons name="hanger" size={16} color="#6A5ACD" />
                            <Text style={styles.tryOnText}>Try-On</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.addToClosetButton, isInCloset && styles.addedButton]}
                            onPress={handleAddToCloset}
                        >
                            <MaterialCommunityIcons
                                name="hanger"
                                size={16}
                                color={isInCloset ? "#FFF" : "#6A5ACD"}
                            />
                            <Text style={[styles.addToClosetText, isInCloset && styles.addedText]}>
                                {isInCloset ? "Added to My Closet" : "Add to My Closet"}
                            </Text>
                            {!isInCloset && <Text style={styles.plusIcon}>+</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Toast
                visible={showToast}
                message="Saved to My Closet"
                actionLabel="See My Closet"
                onAction={() => console.log("Navigate to Closet")}
                onHide={() => setShowToast(false)}
            />

            {/* Feedback Modal */}
            <Modal
                visible={showFeedbackModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFeedbackModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowFeedbackModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHandle} />

                                <TouchableOpacity style={styles.feedbackOption} onPress={() => setShowFeedbackModal(false)}>
                                    <MaterialCommunityIcons name="tag-outline" size={24} color="#000" />
                                    <Text style={styles.feedbackText}>This price isn't for me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.feedbackOption} onPress={() => setShowFeedbackModal(false)}>
                                    <MaterialCommunityIcons name="hanger" size={24} color="#000" />
                                    <Text style={styles.feedbackText}>I prefer other brands</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.feedbackOption} onPress={() => setShowFeedbackModal(false)}>
                                    <MaterialCommunityIcons name="tshirt-crew-outline" size={24} color="#000" />
                                    <Text style={styles.feedbackText}>Not my style</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        width: '60%',
        height: 350,
        alignSelf: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 12,
        position: 'relative', // For absolute positioning of more options button
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    moreOptionsButton: {
        position: 'absolute',
        top: 0,
        right: -70, // Position outside the image to the right
        padding: 8,
    },
    infoContainer: {
        paddingHorizontal: 24,
    },
    brand: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
        fontFamily: 'System',
        letterSpacing: 0.5,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        color: '#6A5ACD',
        marginRight: 4,
        fontFamily: 'System',
        lineHeight: 24,
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 32,
        fontFamily: 'System',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    tryOnButton: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#6A5ACD',
        borderRadius: 22,
        gap: 8,
        backgroundColor: '#fff',
    },
    tryOnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6A5ACD',
    },
    addToClosetButton: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#6A5ACD',
        borderRadius: 22,
        gap: 8,
        backgroundColor: '#fff',
    },
    addedButton: {
        backgroundColor: '#6A5ACD',
    },
    addToClosetText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6A5ACD',
    },
    addedText: {
        color: '#FFF',
    },
    plusIcon: {
        fontSize: 16,
        color: '#6A5ACD',
        fontWeight: '600',
        marginTop: -2,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    feedbackOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    feedbackText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '400',
    },
});
