import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
import { styles } from "./index.styles";
import { UserCirclePlusIcon } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header có nền uốn lượn */}
      <ImageBackground
        source={require("../../assets/images/header-bg.png")}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sdutit</Text>
        </View>
      </ImageBackground>

      {/* Nút đăng nhập / đăng ký */}
      <View style={styles.buttonContainer}>
        {/* Nút Đăng Nhập */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Nút Đăng Ký */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <View style={styles.registerContent}>
            <UserCirclePlusIcon size={18} weight="bold" color="#0047AB" />
            <Text style={styles.registerText}>  Đăng Ký</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;
