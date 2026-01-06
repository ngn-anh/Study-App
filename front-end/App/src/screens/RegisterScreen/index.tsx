import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { styles } from "./index.styles";
import { Picker } from "@react-native-picker/picker";
import { getClasses, ClassItem } from "../../api/class";
import { UserCirclePlusIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon, PhoneIcon } from "phosphor-react-native";
import { CustomModal } from "../../components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types/data";
import { registerUser } from "../../api/auth";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ⚡ STATE CLASS
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState("");

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const showModal = (message: string, type: 'success' | 'error' = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  // ⚡ Load class list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.log("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showModal("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    try {
      const result = await registerUser({
        username,
        email,
        password,
        class_id: classId || null, 
      });

      const userData = result.data;

      // Lưu userData vào AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      setTimeout(() => {
        navigation.navigate("MainTabs", {
          screen: "Home",
          params: { showNotificationPopup: true },
        });
      }, 1000);

    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng ký thất bại, thử lại sau";
      showModal(message, "error");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/header-bg.png")}
        style={styles.headerBackground}
        imageStyle={styles.imageStyle}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={22} color="#fff" weight="bold" />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Username */}
        <Text style={styles.label}>Username <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput
          placeholder="Vui lòng nhập username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        {/* Email */}
        <Text style={styles.label}>Email <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput
          placeholder="Vui lòng nhập email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* SELECT CLASS */}
        <Text style={styles.label}>Lớp <Text style={{ color: "red" }}>*</Text></Text>
        <View style={styles.selectWrapper}>
          <Picker
            style={styles.picker}
            selectedValue={classId}
            onValueChange={(value: any) => setClassId(value)}
          >
            <Picker.Item label="-- Chọn lớp --" value="" style={styles.pickerItem} />
            {classes.map((item) => (
              <Picker.Item key={item._id} label={item.name} value={item._id} style={styles.pickerItem} />
            ))}
          </Picker>
        </View>

        {/* Password */}
        <Text style={styles.label}>Mật khẩu <Text style={{ color: "red" }}>*</Text></Text>
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

        {/* Confirm Password */}
        <Text style={styles.label}>Xác nhận mật khẩu <Text style={{ color: "red" }}>*</Text></Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Nhập lại mật khẩu"
            style={styles.inputPassword}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
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

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default RegisterScreen;
