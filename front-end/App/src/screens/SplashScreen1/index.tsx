import React, { useEffect } from "react";
import { View, Text, Image, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "./SplashScreen1.styles";
import { useNavigation } from "@react-navigation/native";

const SplashScreen1 = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
          navigation.navigate("SplashScreen2" as never);
        }, 2000);
        return () => clearTimeout(timer);
      }, []);

  return (
    <LinearGradient
      colors={["#041633", "#082C66", "#2266D4"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Tên App */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>E</Text>
        <Text style={styles.appName}>dutit</Text>
      </View>

      {/* Slogan */}
      <Text style={styles.subtitle}>Nâng cao kiến thức - Nâng cao cơ hội</Text>
    </LinearGradient>
  );
};

export default SplashScreen1;
