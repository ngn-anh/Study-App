export const a = '1';
import React, { useEffect } from "react";
import { View, Text, Image, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./SplashScreen2.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen2 = () => {
  const navigation = useNavigation();

  const isTokenValid = async () => {
    const data = await AsyncStorage.getItem("userData");
    console.log(data)
    if (!data) return false;

    const userData = JSON.parse(data);
    const now = Math.floor(Date.now() / 1000);

    return userData.user.token_expired > now;
  };


  useEffect(() => {
    const checkAuth = async () => {
      const valid = await isTokenValid();

      setTimeout(() => {
        if (valid) {
          // Token còn hạn → vào app
          navigation.reset({
            index: 1,
            routes: [{ name: "MainTabs" as never }],
          });
        } else {
          // Token hết hạn → xóa data và quay về đăng nhập
          AsyncStorage.removeItem("userData");
          navigation.navigate("AuthScreen" as never);
        }
      }, 2500); // chờ splash hiển thị
    };

    checkAuth();
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
