import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
} from "phosphor-react-native";
import { styles } from "./index.styles";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require("../../assets/images/header-bg.png")}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={22} color="#fff" weight="bold" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Email */}
        <Text style={styles.label}>
          Email: <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="Vui lòng nhập email"
          style={styles.input}
          keyboardType="email-address"
        />

        {/* Mật khẩu */}
        <Text style={styles.label}>
          Mật khẩu: <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Vui lòng nhập mật khẩu"
            style={styles.inputPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconEye}
          >
            {showPassword ? (
              <EyeIcon size={20} color="#0047AB" />
            ) : (
              <EyeSlashIcon size={20} color="#0047AB" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Nút Đăng nhập */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Cụm Liên hệ hỗ trợ (đưa xuống cuối) */}
        <View style={styles.supportContainer}>
          <TouchableOpacity style={styles.supportLink}>
            <PhoneIcon  size={18} color="#1669EF" weight="bold" />
            <Text style={styles.supportText}>  Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
