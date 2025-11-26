import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ToastProps {
    visible: boolean;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    onHide: () => void;
}

export default function Toast({ visible, message, actionLabel, onAction, onHide }: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => onHide());
        }
    }, [visible, onHide, opacity]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <Text style={styles.message}>{message}</Text>
            {actionLabel && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, // Increased to be above Tab Bar
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
    },
    message: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    action: {
        fontSize: 14,
        color: '#6A5ACD',
        fontWeight: '600',
    },
});
