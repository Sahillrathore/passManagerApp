import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUser } from '../userContext';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import AddPassForm from '../../components/AddPassForm';

export default function Home() {

  const { user, setUser } = useUser(); 

  const savedPasswords = [
    { id: '1', name: 'Figma account', email: 'joshuasanugroho@gmail.com', img: 'https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/3000/figma-logo-512.png' },
    { id: '2', name: 'Instagram account', email: 'sijoshuanugroho', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png' },
    { id: '3', name: 'Figma account', email: 'joshuasanugroho@gmail.com', img: 'https://pngimg.com/d/github_PNG40.png' },
    { id: '4', name: 'Instagram account', email: 'sijoshuanugroho', img: 'https://static.vecteezy.com/system/resources/thumbnails/018/930/698/small/facebook-logo-facebook-icon-transparent-free-png.png' },
    // { id: '5', name: 'Figma account', email: 'joshuasanugroho@gmail.com' },
    // { id: '6', name: 'Instagram account', email: 'sijoshuanugroho' },
  ];

  const navigation = useNavigation();

  const [passwords, setPasswords] = useState([]);
  const [showPassForm, setShowPassForm] = useState(false);

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

        // setLoading(false);
      },
      (error) => {
        console.error("Error listening to passwords collection:", error.message);
        // setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user?.uid]);

  const renderItem = ({ item }) => (
    <View style={styles.savedPasswordItem}>
      <Image
        source={{ uri: item.img }}
        style={{height: '30px',width: '30px'}}
        resizeMode="cover" // Optional: control image sizing
      />
      <View>
        <Text style={styles.savedPasswordName}>{item.name}</Text>
        <Text style={styles.savedPasswordEmail}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, <span style={styles.subtext}>{user?.email}</span></Text>
        <Text style={styles.subtext}>Save your password easily and securely</Text>
      </View>

      <View style={styles.newPasswordContainer}>
        <Text style={styles.userIcon}>
          <FontAwesome5 name="user-astronaut" size={22} color="white" />
        </Text>
        <Text style={styles.newPasswordText}>New password</Text>
        <Text style={styles.newPasswordSubtext}>Save your new password with ease</Text>
        <TouchableOpacity style={styles.addNewButton}
          onPress={()=>setShowPassForm(!showPassForm)}
        >
          <Text style={styles.addNewText}>Add new +</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <TouchableOpacity style={styles.summaryBox}>
          <View style={styles.summaryIcons}>
            <MaterialCommunityIcons name="key-variant" size={24} color="white" />
          </View>
          <Text style={styles.summaryNumber}>{passwords?.length} pass</Text>
          <Text style={styles.summaryText}>Saved password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.summaryBox}>
          <View style={[styles.summaryIcons, { backgroundColor: '#47B5CC' }]}>
            <MaterialCommunityIcons name="web" size={24} color="white" />
          </View>
          <Text style={styles.summaryNumber}>{passwords?.length} sites</Text>
          <Text style={styles.summaryText}>Saved sites</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={savedPasswords} // Data source
        keyExtractor={(item) => item.id} // Unique key for each item
        renderItem={renderItem} // Render each item
        showsVerticalScrollIndicator={false} // Hide scroll indicator
      />

      {
        showPassForm &&
        <AddPassForm showPassForm={showPassForm} setShowPassForm={setShowPassForm} />
      }
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    marginBottom: 20,
    paddingTop: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
  newPasswordContainer: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  newPasswordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  newPasswordSubtext: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 10,
  },
  userIcon: {
    backgroundColor: '#ffffff2e',
    marginBottom: 4,
    padding: 10,
    borderRadius: 100,
    paddingHorizontal: 12,
    width: 'fit-content'

  },
  summaryIcons: {
    backgroundColor: '#6654C1',
    marginBottom: 4,
    padding: 10,
    borderRadius: 100,
    paddingHorizontal: 10,
    width: 'fit-content'

  },
  addNewButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  addNewText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8,
  },
  summaryBox: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 0,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  savedPasswordContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  savedPasswordContainerr: {
    backgroundColor: '#f5f5f5',
    // padding: 15,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row'
  },
  savedPasswordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  latestSave: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  savedPasswordItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  savedPasswordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  savedPasswordEmail: {
    fontSize: 14,
    color: '#666',
  },
});
