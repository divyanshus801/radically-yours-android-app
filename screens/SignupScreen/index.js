import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../assets/logo_1.png";
import CustomInput from "../../components/CustomInput";
import Custombutton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";



const SignUpScreen = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordRepeat: "",
    success: false,
    loading: false,
  });
  const [error, setError] = useState("");

  const { fullName, email, password, passwordRepeat, success, loading } =
    userInfo;

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const API = `https://radically-yours-server.herokuapp.com/api`;

  
  const isValidObjField = () => {
    if(fullName === '' ||
       email === '' ||
       password === '' ||
       passwordRepeat === ''
    )
    {return false}else{
      return true
    }
    // return Object.values(obj).every(value => value.trim())
  };
  const updateError = (error, stateUpdater) => {
    stateUpdater(error);
    setTimeout(() => {
      stateUpdater("");
    }, 2500);
  };
  
  const isValidEmail = (value) => {
  const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regx.test(value)
  }
  

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    //all fields must be filled
    if (!isValidObjField()) return updateError("All Fields are Required!", setError);
    //name field with 3 or more character
    if(!fullName.trim() || fullName.length < 3) return updateError("Name should be 3 character long!", setError);
    //only valid email is required
    if(!isValidEmail(email)) return updateError("Enter a valid email!", setError);
    //password must be 6 character
    if(!password.trim() || password.length < 6) return updateError("Password should be 6 character long!", setError);
    //password and repeatPassword must be same
    if(password !== passwordRepeat) return updateError("Password does not match!", setError);

    return true;
  };

  const onSignUp = async () => {
    if (isValidForm()) {
      //submitform
      setUserInfo({ ...userInfo, loading: true})
     await axios.post(`${API}/signup`, {
        fullName,
        email,
        passwordRepeat,
      }).then(
       (response) => {
          // return response.data
          setUserInfo({
            ...userInfo,
            fullName: "",
            email: "",
            password: "",
            passwordRepeat: "",
            success: true,
            loading: false
          });
          setError("");
        }
      ).catch(
      (error) => {
          console.log(error?.response?.data?.message);
          Promise.reject(error)
          updateError(error?.response?.data?.message,setError)
          setUserInfo({
            ...userInfo,
            fullName: "",
            email: "",
            password: "",
            passwordRepeat: "",
            success: false,
            loading: false
          });
          
        }
      )
      // console.log("res",res.data);
    }
  };

  const onLoginHere = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.root}>
      <Text style={styles.loginText}>Create an account</Text>

    {error ? <Text style={{color: "red", fontSize: 15, textAlign: "center", fontWeight: "bold"}} >{error}</Text> : null}
    {success ? <Text style={{color: "green", fontSize: 15, textAlign: "center", fontWeight: "bold"}} >User Registered Succesfully. Please Login</Text> : null}

      <CustomInput
        placeholder="Full Name"
        value={fullName}
        setValue={(value) => handleOnChangeText(value, "fullName")}
      />
      <CustomInput
        placeholder="Email"
        value={email}
        setValue={(value) => handleOnChangeText(value, "email")}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={(value) => handleOnChangeText(value, "password")}
        secureTextEntry={true}
      />
      <CustomInput
        placeholder="Re-enter Password"
        value={passwordRepeat}
        setValue={(value) => handleOnChangeText(value, "passwordRepeat")}
        secureTextEntry={true}
      />
      <Custombutton
        text={loading ? "Loading..." : "Register"}
        onPress={onSignUp}
      />
      <Text style={styles.text}>
        By Registering, you confirm that you accept our{" "}
        <Text style={styles.link}>Terms of Use</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.{" "}
      </Text>
      <Custombutton
        text={"Already have an account? Login here"}
        onPress={onLoginHere}
        type={"TERTIARY"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },

  loginText: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 30,
    marginBottom: 50,
    color: "#575353",
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
});

export default SignUpScreen;
