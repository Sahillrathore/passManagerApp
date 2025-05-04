import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from "../userContext";
import CryptoJS from 'crypto-js';
import Clipboard from "@react-native-clipboard/clipboard";
import EditForm from "../../components/EditForm";

const PassManager = () => {

  const { user } = useUser();

  const [searchText, setSearchText] = useState("");

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [credentials, setCredentials] = useState({
    site: '',
    username: '',
    password: ''
  })

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'sdlakndsnbguyt783264873798grevdsd').toString();
  };

  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'sdlakndsnbguyt783264873798grevdsd');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };
  
  const [editFromVisible, setEditFormVisible] = useState(false);
  const [passToEdit, setPassToEdit] = useState();
  const [oldCredentials, setOldCredentials] = useState();

  const filteredData = passwords?.filter((item) => {
    const decryptedSite = decryptData(item?.site);
    return decryptedSite.toLowerCase().includes(searchText.trim().toLowerCase());
  });



  const savePassword = async () => {

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const uid = user.uid; // Get the UID of the currently authenticated user
    if (!uid) {
      console.error("User UID is required to save a password.");
      return;
    }

    try {
      // Validate credentials
      if (!credentials.password || !credentials.site || !credentials.username) {
        console.error("All fields (site, username, password) are required.");
        return;
      }

      // Encrypt each field individually
      const encryptedSite = encryptData(credentials.site);
      const encryptedUsername = encryptData(credentials.username);
      const encryptedPassword = encryptData(credentials.password);

      // Reference to the user's subcollection in Firestore

      const userPasswordsCollection = collection(db, 'passwords', uid, 'userPasswords');
      console.log(userPasswordsCollection);


      // Add the encrypted data as separate fields in a new document
      await addDoc(userPasswordsCollection, {
        site: encryptedSite,
        username: encryptedUsername,
        password: encryptedPassword,
      });
      console.log('sah');

      console.log("Password saved successfully!");

      // Clear credentials after saving (optional)
      credentials.username = "";
      credentials.password = "";
      credentials.site = "";

    } catch (error) {
      console.error("Error saving password:", error.message);
    }
  };

  const deletePassword = async (docId) => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const uid = user.uid; // Get the UID of the currently authenticated user
    if (!uid) {
      console.error("User UID is required to delete a password.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this password?");
    if (!confirmDelete) {
      // console.log("Password deletion canceled.");
      return;
    }

    try {
      // Reference to the specific document in the user's subcollection
      const passwordDocRef = doc(db, 'passwords', uid, 'userPasswords', docId);

      // Delete the document
      await deleteDoc(passwordDocRef);

      // console.log("Password deleted successfully!");

    } catch (error) {
      console.error("Error deleting password:", error.message);
    }
  };

  const editModal = (id, site, pass, username) => {
    setPassToEdit(id)
    const oldCred = {pass, site, username}
    setOldCredentials(oldCred)
    setEditFormVisible(true);
  }

  const changeHandler = (name, value) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {

    if (!user?.uid) {
      console.error("User UID is required to retrieve passwords.");
      return;
    }

    const uid = user?.uid;

    // Reference to the user's subcollection
    const userPasswordsCollection = collection(db, "passwords", uid, "userPasswords");

    // Set up a Firestore listener
    const unsubscribe = onSnapshot(
      userPasswordsCollection,
      (snapshot) => {
        const passwords = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPasswords(passwords);
        // console.log(passwords);

        setLoading(false);
      },
      (error) => {
        console.error("Error listening to passwords collection:", error.message);
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user?.uid]);

  // Render item function for FlatList
  const renderCard = ({ item }) => {

    const isVisible = visiblePasswords[item.id];

    return (
      <View style={styles.card}>
        {/* Circular elements for background */}
        <View style={[styles.circle, styles.circleTopLeft]} />
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />

        {/* Card Content */}
        <Text style={styles.siteName}>{decryptData(item?.site)}</Text>
        <Text style={styles.username}>{decryptData(item?.username)}</Text>

        <TextInput
          style={styles.password}
          value={isVisible ? decryptData(item?.password) : "*******"}
          editable={false}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => togglePasswordVisibility(item.id)}
          >
            <Icon
              name={isVisible ? "eye-off" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}
            onPress={() => { editModal(item?.id, item?.site, item?.password, item?.username) }}
          >
            <Icon name="pencil" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}
            onPress={() => { deletePassword(item?.id) }}
          >
            <Icon name="delete" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const decryptedPassword = decryptData(item?.password);
              Clipboard.setString(decryptedPassword);
              alert("Password copied to clipboard!"); // Feedback (you can customize this)
            }}
          >
            <Icon name="content-copy" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    )
  };
  
  return (
    <ScrollView style={styles.container}>

      <View style={{ paddingHorizontal: 12 }}>

        <Text style={{ fontSize: 15, opacity: 0.8, marginBottom: 10, marginTop: 12, }}>
          Enter Password Info that you want to save
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
        <TouchableOpacity style={styles.button} onPress={savePassword}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>

        {/* Search */}
        <Text style={styles.subHeader}>All Your Passwords</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Card List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.cardList}
        />
      </View>

      {
        editFromVisible &&
        <EditForm
          user={user}
          passToEdit={passToEdit}
          credentials={credentials}
          setCredentials={setCredentials}
          editFromVisible={editFromVisible}
          setEditFormVisible={setEditFormVisible}
          oldCredentials={oldCredentials}
        />
      }

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002855",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: '#16379A',
    color: '#fff',
    paddingVertical: 4
    // paddingHorizontal: 16
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
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 14,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardList: {
    marginTop: 16,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  listContent: {
    paddingBottom: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#9333ea",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 100,
  },
  circleTopLeft: {
    top: -40,
    left: -40,
    width: 100,
    height: 100,
  },
  circleTopRight: {
    top: -20,
    right: -20,
    width: 60,
    height: 60,
  },
  circleBottomLeft: {
    bottom: -40,
    left: 30,
    width: 130,
    height: 130,
  },
  siteName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  username: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  password: {
    color: "white",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PassManager;
