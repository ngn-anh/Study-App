import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import { CalendarDotsIcon, ClockIcon, EyeIcon, FileArrowDownIcon, QuestionIcon, ShareFatIcon } from "phosphor-react-native";
// import ButtonCustom from "../../components/ButtonCustom";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icons } from "../../constants/icons";
import ButtonCustom from "../../components/ButtonCustom/index";
import { useEffect, useState } from "react";
import PreviewExam from "../../components/PreviewExam/index";
import HistoryExamUser from "../../components/HistoryExamUser/index";
import Header from "../../components/Header/index";
import { formatDate } from "../../utils/time";
import { Exam, User, UserInfo } from "../../types/typeObj";
import { getExamInfo, increaseExamDownload } from "../../api/exam";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  downloadExamPdf,
  previewExamPdf
} from "../../api/pdf";
import { toggleExamLike } from "../../api/likeExam";
import { SUBMITTED_EXAM } from "../../constants";
import RNFetchBlob from 'react-native-blob-util';

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamDetailScreen'>;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const TabKey = {
  Preview: "preview",
  History: "history",
} as const;

const PracticeExamDetailScreen = (props: Props) => {
  const { route } = props;
  // const { examId, subjectCode, submitted } = route.params;
  const { examId, submitted } = route.params;
  console.log("loanhtm examId,  submitted: ", examId, submitted)
  const navigation = useNavigation<NavigationProps>();

  const [user, setUser] = useState<User | null>(null);
  const [examInfo, setExamInfo] = useState<Exam | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [sharingDeepLink, setSharingDeepLink] = useState(false);

  const [liking, setLiking] = useState(false);

  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        setUser(userData?.user);
      } else {
        console.log('Không tìm thấy user data');
      }
    } catch (error) {
      console.error('Lỗi khi lấy user data:', error);
    }
  };

  const fetchGetExamInfo = async () => {
    try {
      if (!examId) return;
      const data = await getExamInfo(examId);
      setExamInfo(data);
    } catch (err) {
      console.error("Không lấy được thông tin bài thi:", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    fetchGetExamInfo();
  }, [examId]);
  // Cấu hình base URL cho PDF service (nên đặt trong file config)
  // useEffect(() => {
  //   // Cấu hình URL API backend
  //   pdfService.setBaseUrl("http://your-api-url:3000"); // Thay bằng URL thật của bạn
  // }, []);

  // const fileNamePdf = `${exam?.name ?? ''}.pdf`;
  const [activeTab, setActiveTab] = useState<string>(TabKey.Preview);

  useEffect(() => {
    if (!!submitted && submitted == SUBMITTED_EXAM.DE_LUYEN) {
      setActiveTab(TabKey.History);
    } else {
      setActiveTab(TabKey.Preview);
    }
  }, [submitted]);

  const handlePressDoExam = () => {
    navigation.navigate('PracticeExamSettingScreen', { examId: examInfo?._id });
  };

  /** --------------------------------------------------------------
   *  Toggle like / unlike cho exam hiện tại
   * -------------------------------------------------------------- */
  const handleToggleLike = async () => {
    if (!user?.id || !examInfo) {
      console.warn("User hoặc examInfo chưa sẵn sàng");
      return;
    }

    const currentlyLiked = examInfo.is_liked ?? 0;          // 0 or 1
    const newLikeState = (currentlyLiked === 1) ? 0 : 1;    // flip

    try {
      const param = {
        user_id: user.id,
        exam_id: examInfo._id,
        is_liked: currentlyLiked,
      }
      console.log("loanhtm param: ", param);
      // ---- 2️⃣ gọi API --------------------------------------------------------
      const resp = await toggleExamLike(param);
      console.log("loanhtm resp: ", resp);
      if (resp.errorCode === 0) {
        setLiking(true);

        setExamInfo(prev => ({
          ...prev!,
          is_liked: newLikeState,
          total_like: (prev?.total_like ?? 0) + (newLikeState === 1 ? 1 : -1),
        }));
      } else {
        setLiking(false);
        // API báo lỗi → rollback
        setExamInfo(prev => ({
          ...prev!,
          is_liked: currentlyLiked,
          total_like:
            (prev?.total_like ?? 0) + (currentlyLiked === 1 ? 1 : -1),
        }));
        console.warn("Like API error:", resp.message);
      }
      // nếu muốn luôn reload lại dữ liệu mới nhất từ server:
      // await fetchGetExamInfo();
    } catch (err) {
      // network error → rollback
      setExamInfo(prev => ({
        ...prev!,
        is_liked: currentlyLiked,
        total_like:
          (prev?.total_like ?? 0) + (currentlyLiked === 1 ? 1 : -1),
      }));
      console.error("❌ toggleLike failed:", err);
    } finally {
      setLiking(false);
    }
  };

  const handleGoBack = () => {
    // navigation.navigate("PracticeExamScreen", {
    //   // subjectId?: string;
    //   subjectCode: subjectCode,
    //   classId: user?.class_id,
    // })
    if (!!submitted && submitted == SUBMITTED_EXAM.DE_LUYEN) {
      navigation.navigate("MainTabs");
    } else {
      navigation.goBack();
    }
  }

  const onSelectTab = (tab: string) => () => setActiveTab(tab);

  const handleDownloadPdf = async () => {
    if (downloading) return;

    try {
      setDownloading(true);
      if (!examId) return;

      const filePath = await downloadExamPdf(
        examId,
        examInfo?.name || "Đề thi"
      );

      if (!filePath) {
        console.error("Lỗi không tải được file Pdf");
        return;
      };

      increaseExamDownload(examId)
        .then((res) => {
          if (res?.errorCode === 0) {
            setExamInfo((prev) =>
              prev ? { ...prev, total_download: res.data } : prev
            );
            console.log("Tăng lượt download thành công");
          } else {
            console.log("Tăng lượt download thất bại");
          }
        })
        .catch(() => { });

      // (OPTIONAL) Mở file ngay sau khi tải
      // RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');

    } catch (error) {
      console.error('Không thể tải đề thi PDF', error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePreviewPdf = async () => {
    if (!examId) return;
    try {
      const filePath = await previewExamPdf(examId, examInfo?.name);

      if (Platform.OS === 'android') {
        RNFetchBlob.android.actionViewIntent(
          filePath,
          'application/pdf',
        );
      } else {
        RNFetchBlob.ios.openDocument(filePath);
      }
    } catch (error) {
      console.error(error);
      console.log('Lỗi', 'Không thể xem trước PDF');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        data={examInfo}
        title="Chi tiết đề thi"
        handleGoBack={handleGoBack}
      />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.infoExamContainer}>
            <Image source={{ uri: examInfo?.image }} style={styles.imageExam} />
            <View style={styles.nameLike}>
              <Text style={styles.nameExam}>{examInfo?.name ?? ''}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleToggleLike}
                  style={styles.iconGroupLink}
                >
                  <Image
                    source={
                      Icons.LikeIcon
                      // (examInfo?.is_liked == 1)
                      //   ? Icons.LikeIcon
                      //   : Icons.LikeIcon
                    }
                    style={[
                      styles.iconLink,
                      { tintColor: (examInfo?.is_liked == 1) ? "#1669EF" : "#555" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.linkText,
                      { color: (examInfo?.is_liked == 1) ? "#1669EF" : "#555" },
                    ]}
                  >
                    {(examInfo?.is_liked == 1) ? "Đã thích" : "Thích"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.iconGroupLink}>
                  <Image source={Icons.ShareIcon} style={styles.iconLink} />
                  <Text style={styles.linkText}>Chia sẻ</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoExam}>
              <View style={styles.infoExamLeft}>
                <View style={styles.itemLeft}>
                  <QuestionIcon color="#000000" />
                  <Text style={styles.itemValue}>{examInfo?.numberQuestion + " câu"}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <ClockIcon color="#000000" />
                  <Text style={styles.itemValue}>{examInfo?.duration + " phút"}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <CalendarDotsIcon color="#000000" />
                  <Text style={styles.itemValue}>{formatDate(examInfo?.created_at + "")}</Text>
                </View>
              </View>
              <View style={styles.infoExamRight}>
                <View style={styles.itemRight}>
                  <Text style={styles.itemValueRight}>{examInfo?.participants}</Text>
                  <Text style={styles.itemDesRight}>Lượt thi</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemValueRight}>{examInfo?.total_like}</Text>
                  <Text style={styles.itemDesRight}>Lượt thích</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemValueRight}>{examInfo?.total_download}</Text>
                  <Text style={styles.itemDesRight}>Lượt tải</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <View style={{ paddingHorizontal: 8 }}>
              <ButtonCustom
                type="primary"
                name="Làm Bài"
                image={Icons.DocumentIcon}
                styleImage={{ width: 24, height: 24, marginRight: 8 }}
                paddingVertical={12}
                onPress={handlePressDoExam}
              />
            </View>
            <View style={styles.actionDownloadShare}>
              <View style={styles.nameExamPdf}>
                <Image source={Icons.PdfIcon} style={styles.pdfIcon} />
                <Text
                  style={styles.nameExamShort}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {`${examInfo?.name ?? ''}.pdf`}
                </Text>
              </View>
              {/* Nút tải PDF (menu options) */}
              <TouchableOpacity
                style={[
                  styles.action,
                  downloading && styles.actionDisabled
                ]}
                onPress={handleDownloadPdf}
                disabled={downloading}
                activeOpacity={0.7}
              >
                {downloading ? (
                  <Text style={styles.loadingText}>...</Text>
                ) : (
                  <FileArrowDownIcon
                    style={{ width: 14, height: 18 }}
                    color="#FFFFFF"
                    weight="bold"
                  />
                )}
              </TouchableOpacity>

              {/* Nút xem trước */}
              <TouchableOpacity
                style={[
                  styles.action,
                  previewing && styles.actionDisabled
                ]}
                onPress={handlePreviewPdf}
                disabled={previewing}
                activeOpacity={0.7}
              >
                {previewing ? (
                  <Text style={styles.loadingText}>...</Text>
                ) : (
                  <EyeIcon
                    style={{ width: 18, height: 15 }}
                    color="#FFFFFF"
                    weight="bold"
                  />
                )}
              </TouchableOpacity>

              {/* Nút chia sẻ thông tin */}
              <TouchableOpacity
                style={styles.action}
                // onPress={handleShareExamInfo}
                // onPress={handleShareApp}
                activeOpacity={0.7}
              >
                <ShareFatIcon
                  style={{ width: 18, height: 15 }}
                  color="#FFFFFF"
                  weight="bold"
                />
              </TouchableOpacity>

            </View>


          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.tabContainer}>
            {/* Tab Xem trước */}
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === TabKey.Preview && styles.tabItemActive,
              ]}
              activeOpacity={0.7}
              onPress={onSelectTab(TabKey.Preview)}
              accessibilityLabel="Xem trước"
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === TabKey.Preview && styles.tabLabelActive,
                ]}
              >
                Xem trước
              </Text>
            </TouchableOpacity>

            {/* Tab Lịch sử thi */}
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === TabKey.History && styles.tabItemActive,
              ]}
              activeOpacity={0.7}
              onPress={onSelectTab(TabKey.History)}
              accessibilityLabel="Lịch sử thi"
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === TabKey.History && styles.tabLabelActive,
                ]}
              >
                Lịch sử thi
              </Text>
            </TouchableOpacity>
          </View>

          {/* ----------------- CONTENT OF SELECTED TAB ----------------- */}
          <View style={styles.tabContent}>
            {activeTab === TabKey.Preview ? (
              <PreviewExam examId={examInfo?._id} />
            ) : (
              <HistoryExamUser
                examId={examInfo?._id}
                userId={user?.id}
              />
            )}
          </View>
        </View>
      </ScrollView >
    </View >

  );
}

export default PracticeExamDetailScreen;
