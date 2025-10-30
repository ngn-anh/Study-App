import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { styles } from "./index.styles";
import { UserCirclePlusIcon } from "phosphor-react-native";

const AuthScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Phần nền uốn lượn */}
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

      {/* Nút Đăng nhập / Đăng ký */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton}>
          {/* icon + text xếp ngang */}
          <View style={styles.registerContent}>
            <UserCirclePlusIcon  size={18} weight="bold" color="#0047AB" />
            <Text style={styles.registerText}>  Đăng Ký</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;
