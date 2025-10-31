import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  UserCirclePlusIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  ArrowLeftIcon,
} from "phosphor-react-native";
import { styles } from "./index.styles";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header uốn lượn */}
      <ImageBackground
        source={require("../../assets/images/header-bg.png")}
        style={styles.headerBackground}
        imageStyle={styles.imageStyle}
      >
        {/* Nút quay lại */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={22} color="#fff" weight="bold" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Form đăng ký */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Họ tên */}
        <Text style={styles.label}>
          Họ và tên <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="Vui lòng nhập họ tên"
          style={styles.input}
        />

        {/* Email */}
        <Text style={styles.label}>
          Email <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="Vui lòng nhập email"
          style={styles.input}
          keyboardType="email-address"
        />

        {/* Mật khẩu */}
        <Text style={styles.label}>
          Mật khẩu <Text style={{ color: "red" }}>*</Text>
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

        {/* Xác nhận mật khẩu */}
        <Text style={styles.label}>
          Xác nhận mật khẩu <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Nhập lại mật khẩu"
            style={styles.inputPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.iconEye}
          >
            {showConfirmPassword ? (
              <EyeIcon size={20} color="#0047AB" />
            ) : (
              <EyeSlashIcon size={20} color="#0047AB" />
            )}
          </TouchableOpacity>
        </View>

        {/* Nút đăng ký */}
        <TouchableOpacity style={styles.registerButton}>
          <UserCirclePlusIcon size={18} weight="bold" color="#0047AB" />
          <Text style={styles.registerText}>Đăng Ký</Text>
        </TouchableOpacity>
      </ScrollView>

       {/* Liên hệ hỗ trợ */}
        <View style={styles.supportContainer}>
          <TouchableOpacity style={styles.supportLink}>
            <PhoneIcon size={18} color="#1669EF" weight="bold" />
            <Text style={styles.supportText}>  Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default RegisterScreen;
