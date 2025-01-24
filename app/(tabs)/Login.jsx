import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Ensure this points to your Firebase config file
import { useUser } from '../userContext';

const Login = ({ onLoginSuccess, switchToSignup }) => {

    const {user, setUser} = useUser(); 
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            Alert.alert("Success", "You have successfully logged in!");
            
            setUser(userCredential)
            // console.log(user);
            
        } catch (err) {
            Alert.alert("Login Error", err.message);
            console.log(err.message);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>Login to your account in seconds</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => handleChange('email', text)}
                    value={formData.email}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    onChangeText={(text) => handleChange('password', text)}
                    value={formData.password}
                />
            </View>
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>
            <Text style={styles.switchText}>
                Don't have an account?{' '}
                <Text style={styles.switchLink} onPress={switchToSignup}>
                    Signup
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6b46c1',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#a085d8',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchText: {
        marginTop: 15,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    switchLink: {
        color: '#6b46c1',
        fontWeight: 'bold',
    },
});

export default Login;
