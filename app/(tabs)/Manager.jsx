import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PassManager = () => {
  // Sample Data
  const [data, setData] = useState([
    { id: "1", site: "Facebook", username: "john_doe", password: "•••••••" },
    { id: "2", site: "Twitter", username: "jane_doe", password: "•••••••" },
  ]);

  const [newEntry, setNewEntry] = useState({ site: "", username: "", password: "" });
  const [searchText, setSearchText] = useState("");

  const handleSave = () => {
    if (newEntry.site && newEntry.username && newEntry.password) {
      setData([...data, { ...newEntry, id: Date.now().toString() }]);
      setNewEntry({ site: "", username: "", password: "" });
    }
  };

  const filteredData = data.filter((item) =>
    item.site.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render item function for FlatList
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* Circular elements for background */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />

      {/* Card Content */}
      <Text style={styles.siteName}>{item.site}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <TextInput
        style={styles.password}
        value={item.password}
        editable={false}
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="eye" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="delete" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="content-copy" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>SecureVault</Text>

      <View style={{ paddingHorizontal: 12 }}>

        <Text style={{fontSize: 15, opacity: 0.8, marginBottom: 10, marginTop: 12,}}>
          Enter Password Info that you want to save
        </Text>

        {/* Form */}
        <TextInput
          style={styles.input}
          placeholder="Site"
          value={newEntry.site}
          onChangeText={(text) => setNewEntry({ ...newEntry, site: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={newEntry.username}
          onChangeText={(text) => setNewEntry({ ...newEntry, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={newEntry.password}
          onChangeText={(text) => setNewEntry({ ...newEntry, password: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: 12, paddingVertical: 10}}>

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
