import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo_1.png";
import CustomInput from "../../components/CustomInput";
import Custombutton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  // const { authenticate, setAuthenticate } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [textInputHolder, setTextInputHolder] = useState(0);
  const [sumHolder, setSumHolder] = useState(0);
  const [randomNumberOne, setRandomNumberOne] = useState(0);
  const [randomNumberTwo, setRandomNumberTwo] = useState(0);

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const API = `https://radically-yours-server.herokuapp.com/api`;

  const isValidObjField = () => {
    if (email === "" || password === "") {
      return false;
    } else {
      return true;
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
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regx.test(value);
  };

  const isValidForm = () => {
    //all fields must be filled
    if (!isValidObjField())
      return updateError("All Fields are Required!", setError);
    //only valid email is required
    if (!isValidEmail(email))
      return updateError("Enter a valid email!", setError);
    //password must be 6 character
    if (!password.trim() || password.length < 6)
      return updateError("Password should be 6 character long!", setError);
      //captch code valid
     if(!validateCaptchaCode())  return updateError("captcha not verified!", setError);

    return true;
  };

  const onSignIn = async () => {
    if (isValidForm()) {
      //submit login data
      setLoading(true);
      await axios
        .post(`${API}/signin`, {
          email,
          password,
        })
        .then((response) => {
          // return response.data
          setEmail("");
          setPassword("");
          setSuccess(true);
          setLoading(false);
          setError("");
          generateCaptcha();
          navigation.navigate("Home");
          AsyncStorage.setItem("authToken", response.data.token);
          AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          // setAuthenticate(true);
        })
        .catch((error) => {
          console.log(error?.response?.data?.message);
          updateError(error?.response?.data?.message, setError);
          setEmail("");
          setPassword("");
          generateCaptcha();
          setSuccess(false);
          setLoading(false);
        });
    }
  };

  const onForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const onCreateNew = () => {
    navigation.navigate("SignUp");
  };

  generateCaptcha = () => {
    var numberOne = Math.floor(Math.random() * 100) + 1;
    var numberTwo = Math.floor(Math.random() * 100) + 1;
    var sum = numberOne + numberTwo;
    setRandomNumberOne(numberOne);
    setRandomNumberTwo(numberTwo);
    setSumHolder(sum);
  };

  validateCaptchaCode = () => {
    var temp = randomNumberOne + randomNumberTwo;
    if (textInputHolder == temp) {
      //Captcha match
      return true
      // Alert.alert("Captcha Matched");
    } else {
      //Captcha not match
      return false
      // Alert.alert("Captcha NOT Matched");
    }
    // Calling captcha function, to generate captcha code
    generateCaptcha();
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />
      <Text style={styles.loginText}>Login Here</Text>
      {error ? (
        <Text
          style={{
            color: "red",
            fontSize: 15,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </Text>
      ) : null}

      <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />

      <View style={styles.captchaContainerView}>
        <Text style={{ fontSize: 22, textAlign: "center", color: "#000" }}>
          {randomNumberOne} {"+"} {randomNumberTwo} {"= "}
        </Text>

        <TextInput
          placeholder="Enter Captcha"
          onChangeText={(data) => setTextInputHolder(data)}
          style={styles.textInputStyle}
          underlineColorAndroid="transparent"
        />

        <TouchableOpacity onPress={generateCaptcha}>
          <Image
            source={{
              uri: "https://img.icons8.com/ios-glyphs/30/000000/refresh--v1.png",
            }}
            style={{ width: 40, height: 35, resizeMode: "contain", margin: 20 }}
          />
        </TouchableOpacity>
      </View>
      <Custombutton
        text={loading ? "Logging in! Please wait " : "Login"}
        onPress={onSignIn}
      />
      <Custombutton
        text={"Forgot Password"}
        onPress={onForgotPassword}
        type={"TERTIARY"}
      />
      <Custombutton
        text={"Don't have an account? Create new"}
        onPress={onCreateNew}
        type={"TERTIARY"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 200,
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    color: "#575353",
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    padding: 5,
  },
  captchaContainerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7,
  },
});

export default SignInScreen;
