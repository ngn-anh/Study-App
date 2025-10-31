import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { styles } from "./index.styles";
import { UserCirclePlusIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon, PhoneIcon } from "phosphor-react-native";
import { CustomModal } from "../../components/CustomModal";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success'|'error'>('success');

  const showModal = (message: string, type: 'success'|'error' = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showModal("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      showModal("Đăng ký thành công!", "success");
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng ký thất bại, thử lại sau";
      showModal(message, "error");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../assets/images/header-bg.png")} style={styles.headerBackground} imageStyle={styles.imageStyle}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={22} color="#fff" weight="bold" />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Username <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput placeholder="Vui lòng nhập username" style={styles.input} value={username} onChangeText={setUsername} />
        <Text style={styles.label}>Email <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput placeholder="Vui lòng nhập email" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Text style={styles.label}>Mật khẩu <Text style={{ color: "red" }}>*</Text></Text>
        <View style={styles.passwordWrapper}>
          <TextInput placeholder="Vui lòng nhập mật khẩu" style={styles.inputPassword} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconEye}>
            {showPassword ? <EyeIcon size={20} color="#0047AB" /> : <EyeSlashIcon size={20} color="#0047AB" />}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Xác nhận mật khẩu <Text style={{ color: "red" }}>*</Text></Text>
        <View style={styles.passwordWrapper}>
          <TextInput placeholder="Nhập lại mật khẩu" style={styles.inputPassword} secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconEye}>
            {showConfirmPassword ? <EyeIcon size={20} color="#0047AB" /> : <EyeSlashIcon size={20} color="#0047AB" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <UserCirclePlusIcon size={18} weight="bold" color="#0047AB" />
          <Text style={styles.registerText}>Đăng Ký</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.supportContainer}>
        <TouchableOpacity style={styles.supportLink}>
          <PhoneIcon size={18} color="#1669EF" weight="bold" />
          <Text style={styles.supportText}>  Liên hệ hỗ trợ</Text>
        </TouchableOpacity>
      </View>

      <CustomModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default RegisterScreen;
