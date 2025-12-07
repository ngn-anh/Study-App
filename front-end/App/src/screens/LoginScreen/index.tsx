export const a = '2';
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, PhoneIcon } from "phosphor-react-native";
import { styles } from "./index.styles";
import { API_URL } from "@env";
import { CustomModal } from "../../components/CustomModal";
import { RootStackParamList } from "../../types/data";
import { loginUser } from "../../api/auth";


const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const showModal = (message: string, type: 'success' | 'error' = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showModal("Vui lòng nhập username và mật khẩu", "error");
      return;
    }

    try {
      // const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const response = await loginUser({ username, password });
      const userData = response.data;

      // Lưu userData vào AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      showModal("Đăng nhập thành công!", "success");

      // Delay để modal hiển thị trước khi navigate
      setTimeout(() => {
        navigation.reset({
          index: 1,
          routes: [{ name: "MainTabs" }], // reset về tab navigator
        });
      }, 1000);

    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng nhập thất bại, thử lại sau";
      showModal(message, "error");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/header-bg.png")}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={22} color="#fff" weight="bold" />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>
          Username: <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="Vui lòng nhập username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>
          Mật khẩu: <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Vui lòng nhập mật khẩu"
            style={styles.inputPassword}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconEye}>
            {showPassword ? <EyeIcon size={20} color="#0047AB" /> : <EyeSlashIcon size={20} color="#0047AB" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <View style={styles.supportContainer}>
          <TouchableOpacity style={styles.supportLink}>
            <PhoneIcon size={18} color="#1669EF" weight="bold" />
            <Text style={styles.supportText}>  Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;
