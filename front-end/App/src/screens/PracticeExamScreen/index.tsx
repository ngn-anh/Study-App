// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, PhoneIcon } from "phosphor-react-native";
// import { styles } from "./index.styles";
// import { API_URL } from "@env";
// import { CustomModal } from "../../components/CustomModal";
// import { RootStackParamList } from "../../types/data";

import { ScrollView, Text, View } from "react-native";
import { styles } from "./index.styles";
import ExpandDesSubject from "../../components/ExpandDesSubject";

const PracticeExam = () => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);

  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalMessage, setModalMessage] = useState("");
  // const [modalType, setModalType] = useState<'success' | 'error'>('success');

  // const showModal = (message: string, type: 'success' | 'error' = 'success') => {
  //   setModalMessage(message);
  //   setModalType(type);
  //   setModalVisible(true);
  // };

  // const handleLogin = async () => {
  //   if (!username || !password) {
  //     showModal("Vui lòng nhập username và mật khẩu", "error");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  //     const userData = response.data;

  //     // Lưu userData vào AsyncStorage
  //     await AsyncStorage.setItem("userData", JSON.stringify(userData));

  //     showModal("Đăng nhập thành công!", "success");

  //     // Delay để modal hiển thị trước khi navigate
  //     setTimeout(() => {
  //       navigation.reset({
  //         index: 1,
  //         routes: [{ name: "MainTabs" }], // reset về tab navigator
  //       });
  //     }, 1000);

  //   } catch (error: any) {
  //     const message = error.response?.data?.message || "Đăng nhập thất bại, thử lại sau";
  //     showModal(message, "error");
  //   }
  // };

  const description = `
  Bộ đề được biên soạn theo chuẩn chương trình mới nhất

  📘 20 đề thi

  - Đề gồm 22 câu hỏi, chia thành 3 phần:
  + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
  + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
  + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

  - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

  - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

  - Môn Toán là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
  `;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Làm chủ môn Toán</Text>
          <ExpandDesSubject text={description.trim()} numberOfLines={5} />
        </View>
      </ScrollView>
    </View>
  );
}


// return (
//   <View style={styles.container}>
//     <Text>Màn luyện đề</Text>
//     {/* <ImageBackground
//         source={require("../../assets/images/header-bg.png")}
//         style={styles.headerBackground}
//         resizeMode="cover"
//       >
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <ArrowLeftIcon size={22} color="#fff" weight="bold" />
//         </TouchableOpacity>
//       </ImageBackground>

//       <ScrollView contentContainerStyle={styles.formContainer}>
//         <Text style={styles.label}>
//           Username: <Text style={{ color: "red" }}>*</Text>
//         </Text>
//         <TextInput
//           placeholder="Vui lòng nhập username"
//           style={styles.input}
//           value={username}
//           onChangeText={setUsername}
//         />

//         <Text style={styles.label}>
//           Mật khẩu: <Text style={{ color: "red" }}>*</Text>
//         </Text>
//         <View style={styles.passwordWrapper}>
//           <TextInput
//             placeholder="Vui lòng nhập mật khẩu"
//             style={styles.inputPassword}
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconEye}>
//             {showPassword ? <EyeIcon size={20} color="#0047AB" /> : <EyeSlashIcon size={20} color="#0047AB" />}
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity>
//           <Text style={styles.forgotText}>Quên mật khẩu?</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.loginText}>Đăng Nhập</Text>
//         </TouchableOpacity>

//         <View style={styles.supportContainer}>
//           <TouchableOpacity style={styles.supportLink}>
//             <PhoneIcon size={18} color="#1669EF" weight="bold" />
//             <Text style={styles.supportText}>  Liên hệ hỗ trợ</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <CustomModal
//         visible={modalVisible}
//         message={modalMessage}
//         type={modalType}
//         onClose={() => setModalVisible(false)}
//       /> */}
//   </View>
// );
// };

export default PracticeExam;
