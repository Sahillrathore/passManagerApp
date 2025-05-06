import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../app/firebaseConfig';
import { useUser } from "../app/userContext";
import CryptoJS from 'crypto-js';
import Toast from "./Toast";

const AddPassForm = ({ showPassForm, setShowPassForm }) => {
    const { user } = useUser();
    const [toast, setToast] = useState(null);
    const [credentials, setCredentials] = useState({
        site: '',
        username: '',
        password: ''
    });

    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), 'sdlakndsnbguyt783264873798grevdsd').toString();
    };

    const showToast = (type) => {
        setToast({ type, message: type === 'success' ? 'Saved successfully!' : 'Something went wrong!' });
    };

    const savePassword = async () => {
        if (!user) return;
        const uid = user.uid;
        if (!uid) return;

        if (!credentials.site || !credentials.username || !credentials.password) return;

        const encryptedSite = encryptData(credentials.site);
        const encryptedUsername = encryptData(credentials.username);
        const encryptedPassword = encryptData(credentials.password);

        const userPasswordsCollection = collection(db, 'passwords', uid, 'userPasswords');

        await addDoc(userPasswordsCollection, {
            site: encryptedSite,
            username: encryptedUsername,
            password: encryptedPassword,
        });

        console.log('saved');
        showToast('success');

        setCredentials({ site: '', username: '', password: '' });
        setTimeout(() => {
            setShowPassForm(false);
        }, 1000);
    };

    const changeHandler = (field, value) => {
        setCredentials((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowPassForm(false)}>
                    <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    Enter Password Info that you want to save
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Site"
                    value={credentials.site}
                    onChangeText={(text) => changeHandler('site', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={credentials.username}
                    onChangeText={(text) => changeHandler('username', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={credentials.password}
                    onChangeText={(text) => changeHandler('password', text)}
                />
                <TouchableOpacity style={styles.button} onPress={savePassword}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onHide={() => setToast(null)}
                />
            )}
        </View>
    );
};

export default AddPassForm;

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
    modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 10,
        zIndex: 10,
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#000',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        textAlign: 'center',
        width: 200,
        margin: 'auto',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
