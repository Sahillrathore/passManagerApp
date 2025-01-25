import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { updateDoc, doc } from 'firebase/firestore';
import { TextInput } from 'react-native-web';
import CryptoJS from 'crypto-js';
import { db } from '../app/firebaseConfig';

const EditForm = ({ user, passToEdit, credentials, setCredentials, editFromVisible, setEditFormVisible, }) => {

    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), 'sdlakndsnbguyt783264873798grevdsd').toString();
    };

    const decryptData = (encryptedData) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, 'sdlakndsnbguyt783264873798grevdsd');
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    const editPassword = async () => {
        if (!user) {
            console.error("User is not authenticated.");
            return;
        }

        const uid = user.uid; // Get the UID of the currently authenticated user
        if (!uid) {
            console.error("User UID is required to edit a password.");
            return;
        }

        try {
            // Validate the updated credentials
            if (!credentials.site || !credentials.username || !credentials.password) {
                console.error("All fields (site, username, password) are required to update a password.");
                return;
            }

            // Encrypt the updated credentials
            const encryptedSite = encryptData(credentials.site);
            const encryptedUsername = encryptData(credentials.username);
            const encryptedPassword = encryptData(credentials.password);

            // Reference to the specific document in the user's subcollection
            const passwordDocRef = doc(db, 'passwords', uid, 'userPasswords', passToEdit);

            // Update the document with the new encrypted credentials
            
            await updateDoc(passwordDocRef, {
                site: encryptedSite,
                username: encryptedUsername,
                password: encryptedPassword,
            });

            console.log("Password updated successfully!");
            setEditFormVisible(false);

        } catch (error) {
            console.error("Error updating password:", error.message);
        }
    };

    const changeHandler = (name, value) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    return (
        <View style={styles.container}>

            <Text style={{ fontSize: 15, opacity: 0.8, marginBottom: 10, marginTop: 12, }}>
                Enter new Password Info to edit
            </Text>

            {/* Form */}
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
            <TouchableOpacity style={styles.button} onPress={editPassword}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>{setEditFormVisible(false)}}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditForm

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        // position: 'absolute',
        top: 0,
        width: '100%',
        position: 'fixed'
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    button: {
        backgroundColor: "#16379aeb",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 6
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
})