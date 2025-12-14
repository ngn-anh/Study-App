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
import { Class, Exam, Subject, User } from "../../types/typeObj";
import { getClassById } from "../../api/class";
import { getSubjectByClass } from "../../api/subject";
import { LIMIT, TYPE_EXAM } from "../../constants";
import { getExams } from "../../api/exam";
import { toggleExamLike } from "../../api/likeExam";
// import { showMessage } from 'react-native-flash-message';

const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [page, setPage] = useState<number>(1);

  const getUserData = async (): Promise<User | null> => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        setUser(userData?.user);
        return userData?.user;
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
    if (!user?.id || !classInfo?.id) return;

    try {
      // setLoading(true);
      const params = {
        // currentClassCode: classInfo.code,
        class_id: classInfo.id,
        type: TYPE_EXAM.THI_THU,
        user_id: user.id,
        page: page,
        limit: LIMIT,
      };

      const res = await getExams(params);

      setExams(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bài thi:", err);
    } finally {
      // setLoading(false);
    }
  }, [user, classInfo, page]);

  const loadClassInfo = useCallback(async (userData: User) => {
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

  const handleToggleLike = async (examId: string, currentlyLiked: number) => {
    if (!user?.id) {
      console.warn("User chưa đăng nhập → không thể like");
      return;
    }

    const newLikeState = (currentlyLiked === 1) ? 0 : 1;   // đổi 1 ↔ 0

    try {
      const params = {
        user_id: user.id,
        exam_id: examId,
        is_liked: currentlyLiked,
      };

      console.log("home params likeExam: ", params);
      // ---- 2️⃣ Gọi API ----
      const resp = await toggleExamLike(params);
      if (resp.errorCode === 0) {
        // ---- 1️⃣ Optimistic UI (cập nhật ngay trên UI) ----
        setExams(prev =>
          prev.map(e =>
            e._id === examId
              ? {
                ...e,
                is_liked: newLikeState,
                total_like: (e.total_like ?? 0) + ((newLikeState === 1) ? 1 : -1),
              }
              : e
          )
        );
      } else {
        // ---- Nếu API trả lỗi → rollback UI ----
        setExams(prev =>
          prev.map(e =>
            e._id === examId
              ? {
                ...e,
                is_liked: currentlyLiked,
                total_like: (e.total_like ?? 0) + ((currentlyLiked === 1) ? 1 : -1),
              }
              : e
          )
        );
        console.warn("Like API error:", resp.message);
      }
      // Nếu muốn **re‑fetch** list thay vì optimistic, thay thế đoạn trên bằng:
      // await fetchExams();
    } catch (err) {
      // ---- Mạng lỗi → rollback UI ----
      setExams(prev =>
        prev.map(e =>
          e._id === examId
            ? {
              ...e,
              is_liked: currentlyLiked,
              total_like: (e.total_like ?? 0) + ((currentlyLiked === 1) ? 1 : -1),
            }
            : e
        )
      );
      console.error("ToggleLike failed:", err);
    }
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

          <ProfileCard
            user={user}
            classInfo={classInfo}
          />

          <SubjectList
            subjects={subjects}
            classInfo={classInfo}
          />

          <View style={styles.examSection}>
            <ExamList
              exams={exams}
              onToggleLike={handleToggleLike}
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
