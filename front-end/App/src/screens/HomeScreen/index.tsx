export const a = '1';
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { styles } from "./HomeScreen.styles";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import SubjectList from "../../components/SubjectList/SubjectList";
import LinearGradient from "react-native-linear-gradient";
import ExamList from "../../components/ExamList/ExamList";
import { useRoute } from "@react-navigation/native";
import { ConfirmModal } from "../../components/ConfirmModal";
import { BellRingingIcon } from "phosphor-react-native";
import { updateNotificationSetting } from "../../api/notificationSetting";
import AsyncStorage from "@react-native-async-storage/async-storage";


const HomeScreen: React.FC = () => {
  const route = useRoute<any>();
  const [showNotiModal, setShowNotiModal] = useState(false);
  const showPopup = route.params?.showNotificationPopup;

  useEffect(() => {
    if (showPopup) {
      setShowNotiModal(true);
    }
    console.log('route.params', route.params)
  }, []);

  const handleEnableNotification = async () => {
    try {
      // // xin quyền system
      // const authStatus = await messaging().requestPermission();
      // const enabled =
      //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      // if (!enabled) return setShowNotiModal(false);

      // update API
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);
      await updateNotificationSetting(userData.user.id, { is_open_noti: true });

    } catch (err) {
      console.log(err);
    } finally {
      setShowNotiModal(false);
    }
  };


  const handleDisableNotification = () => {
    setShowNotiModal(false);
  };
  return (
    <LinearGradient
      colors={["#170A66", "#3169a8ff", "#fff"]}
      locations={[0, 0.8, 1]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.option}>
              <Image
                source={require("../../assets/icons/option.png")}
                style={styles.bellIcon}
              />
              <Text style={styles.username}>Nguyễn Thị Thu Ngân</Text>
            </View>
            <TouchableOpacity style={styles.notification}>
              <Image
                source={require("../../assets/icons/bell.png")}
                style={styles.bellIcon}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>24</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <ProfileCard
            name="Ngân Cute"
            email="thungan16092003@gmail.com"
            classLevel="Lớp 11"
            avatarUrl="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          />

          {/* Subject section */}
          <SubjectList />

          {/* Exam section */}
          <View style={styles.examSection}>
            <ExamList />
          </View>

        </ScrollView>
      </SafeAreaView>
      <ConfirmModal
        visible={showNotiModal}
        title="Bật thông báo?"
        content="Bạn có muốn bật thông báo về các cập nhật quan trọng của ứng dụng không?"
        cancelText="Không"
        confirmText="Bật"
        type="confirm"
        onCancel={handleDisableNotification}
        onConfirm={handleEnableNotification}
        headerIcon={
          <BellRingingIcon size={25} color="#083070" weight="fill" />
        }
      />
    </LinearGradient>
  );
};

export default HomeScreen;
