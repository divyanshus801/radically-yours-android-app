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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onBackToSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.root}>
      <Text style={styles.loginText}>Reset Your Password</Text>

      <CustomInput placeholder="Email" value={email} setValue={setEmail} />

      <Custombutton text={"Send"}
    //    onPress={onSignUp}
        />
      <Custombutton
        text={"Back to signin"}
        onPress={onBackToSignIn}
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

  loginText: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 30,
    marginBottom: 50,
    color: "#ed3e3e",
  },
});

export default ForgotPassword;
