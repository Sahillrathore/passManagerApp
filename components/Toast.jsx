import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Toast = ({ type = 'success', message, onHide }) => {
    const slideAnim = new Animated.Value(-100); // slide from top

    useEffect(() => {
        Animated.sequence([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onHide());
    }, []);

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
                },
            ]}
        >
            <Ionicons
                name={type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                size={20}
                color="#fff"
                style={styles.icon}
            />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        zIndex: 9999,
    },
    message: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    icon: {
        marginRight: 8,
    },
});

export default Toast;
