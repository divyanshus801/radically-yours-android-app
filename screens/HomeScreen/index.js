import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Logo from "../../assets/logo_1.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [authenticate, setAuthenticate] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const API = `https://radically-yours-server.herokuapp.com/api`;

  const getUsersList = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/getUsersList`);
      setUserList(data);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
    getUsersList();
  }, []);

  const isUserLoggedIn = () => {
    const token = AsyncStorage.getItem("token");
    if (token) {
      setAuthenticate(true);
      //setLoggedUser(JSON.parse(AsyncStorage.getItem("user")));
    } else {
      setAuthenticate(false);
      navigation.navigate("SignIn");
    }
  };

  const onPressLogout = () => {
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('user');
    navigation.navigate("SignIn")
  };

  const onPressDelete = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${API}/user/${userId}`);
      console.log(data);
      setLoading(false);
      getUsersList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.root1}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.2 }]}
          resizeMode="contain"
        />
        <Pressable onPress={onPressLogout} style={styles.btnLogout}>
          <Text style={styles.btnText}>Logout</Text>
        </Pressable>
      </View>
      <ScrollView>
        {userList && userList.map((user) => {
            return (
              <View key={user._id} style={styles.root2}>
                <View style={styles.container}>
                  <Text style={styles.innerText}>Name: {user.fullName}</Text>
                  <Text style={styles.innerText}>email: {user.email}</Text>
                  <Text style={styles.innerText}>Id: {user._id}</Text>
                </View>
                <View style={styles.container}>
                  <Pressable
                    onPress={ ()=> onPressDelete(user._id)}
                    style={styles.button}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                  <Text style={styles.innerText}>Pass: {user.password}</Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {},
  root1: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 8,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "#FBFBFC",
  },
  root2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 8,
    marginHorizontal: 13,
    borderBottomColor: "gray",
    borderBottomWidth: 4,
    borderRadius: 10,
    backgroundColor: "white",
  },
  logo: {
    width: "40%",
    maxWidth: 150,
    maxHeight: 50,
  },
  container: {},
  innerText: {
    padding: 7,
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    width: "60%",
    marginTop: 24,
    margin: 7,
    paddingVertical: 2,
    paddingBottom: 4,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "gray",
  },
  btnLogout: {
    width: "25%",
    margin: 7,
    paddingVertical: 5,
    paddingBottom: 8,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#7F2424",
  },
  btnText: {
    fontWeight: "bold",
    color: "white",
  },
});

export default HomeScreen;
