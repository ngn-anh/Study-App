export const a = '2';
import React, { useEffect } from "react";
import { View, Text, Image, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./SplashScreen2.styles";

const SplashScreen2 = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Khi xong splash 2 → vào Trang chủ
      navigation.navigate("AuthScreen" as never);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#041633", "#082C66", "#2266D4"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Logo trên cùng */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Tên app */}
      <View style={styles.textContainer}>
        <Text style={styles.logoText}>E</Text>
        <Text style={styles.appName}>dutit</Text>
      </View>

      {/* Loading text */}
      <Text style={styles.loadingText}>Vui lòng đợi trong giây lát...</Text>

      {/* Version ở cuối */}
      <Text style={styles.version}>Edutit Version 1.0.0</Text>
    </LinearGradient>
  );
};

export default SplashScreen2;
