import React, { useCallback, useEffect, useState } from "react";
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
import { Class, Exam, Subject, UserInfo } from "../../types/typeObj";
import { getClassById } from "../../api/class";
import { getSubjectByClass } from "../../api/subject";
import { LIMIT, TYPE_EXAM } from "../../constants";
import { getExams } from "../../api/exam";
// import { showMessage } from 'react-native-flash-message';

const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [page, setPage] = useState<number>(1);

  const getUserData = async (): Promise<UserInfo | null> => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        return userData;
      } else {
        console.log('Không tìm thấy user data');
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi lấy user data:', error);
      return null;
    }
  };

  const route = useRoute<any>();
  const [showNotiModal, setShowNotiModal] = useState(false);
  const showPopup = route.params?.showNotificationPopup;

  useEffect(() => {
    if (showPopup) {
      setShowNotiModal(true);
    }
    console.log('route.params', route.params)
  }, []);

  const fetchGetClassById = async (classId: string) => {
    try {
      const res = await getClassById(classId);

      if (res.errorCode === 0) {
        setClassInfo(res.data);
      } else {
        console.log(res.message || "Có lỗi xảy ra khi lấy thông tin lớp");
        // THẤT BẠI: Bắn popup lỗi
        // showMessage({
        //   message: "Thất bại",
        //   description: res.message || "Có lỗi xảy ra",
        //   type: "danger",
        // });
      }
    } catch (error) {
      console.error('Lỗi khi gọi API lớp:', error);
      // showMessage({
      //   message: "Lỗi kết nối",
      //   description: "Không thể kết nối đến server",
      //   type: "danger",
      // });
    }
  };

  const fetchGetSubjectByClass = async (classId: string) => {
    try {
      const res = await getSubjectByClass(classId);

      if (res.errorCode === 0) {
        setSubjects(res.data);
      } else {
        console.log(res.message || "Có lỗi xảy ra khi lấy môn học");
      }
    } catch (error) {
      console.error('Lỗi khi gọi API môn học:', error);
    }
  };

  const fetchExams = useCallback(async () => {
    if (!user?.id || !classInfo?.code) return;

    try {
      // setLoading(true);
      const params = {
        currentClassCode: classInfo.code,
        type: TYPE_EXAM.THI_THU,
        user_id: user.id,
        page: page,
        limit: LIMIT,
      };
      console.log("home exam params", params);

      const res = await getExams(params);

      setExams(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bài thi:", err);
    } finally {
      // setLoading(false);
    }
  }, [user, classInfo, page]);

  const loadClassInfo = useCallback(async (userData: UserInfo) => {
    if (userData.class_id) {
      await fetchGetClassById(userData.class_id);
    }
  }, []);

  // Effect chính - khởi tạo
  useEffect(() => {
    const initializeData = async () => {
      const userData = await getUserData();
      if (userData) {
        await loadClassInfo(userData);
      }
    };
    initializeData();
  }, []);

  // Effect khi có classInfo -> load subjects và exams
  useEffect(() => {
    if (classInfo?.id) {
      fetchGetSubjectByClass(classInfo.id);
      fetchExams();
    }
  }, [classInfo, fetchExams]);

  // // Effect khi page thay đổi -> load lại exams
  // useEffect(() => {
  //   if (page > 1) {
  //     fetchExams();
  //   }
  // }, [page, fetchExams]);

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
              {/* <Text style={styles.username}>Nguyễn Thị Thu Ngân</Text> */}
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
          {/* <ProfileCard
            name="Ngân Cute"
            email="thungan16092003@gmail.com"
            classLevel="Lớp 11"
            avatarUrl="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          /> */}
          <ProfileCard
            user={user}
            classInfo={classInfo}
          />

          {/* Subject section */}
          <SubjectList
            subjects={subjects}
          />

          {/* Exam section */}
          <View style={styles.examSection}>
            <ExamList
              exams={exams}
            />
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
