import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { styles } from "./index.styles";
import { RouteProp, TabActions, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import Header from "../../components/Header";
// import ItemExam from "../../components/ItemExam";
// import { verticalScale } from "../../utils/responsive";
import ButtonCustom from "../../components/ButtonCustom";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ShortInfoExam from "../../components/ShortInfoExam";
import SettingExam from "../../components/SettingExam";
import InstructionDoExam from "../../components/InstructionDoExam";
import { Icons } from "../../constants/icons";
import { useCallback, useEffect, useState } from "react";
import { Exam, User, UserInfo } from "../../types/typeObj";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExamInfo } from "../../api/exam";

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamSettingScreen'>;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const PracticeExamSettingScreen = (props: Props) => {
  const { route } = props;
  const { examId } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const [user, setUser] = useState<User | null>(null);
  const [examInfo, setExamInfo] = useState<Exam | null>(null);
  const [reverseQuestion, setReverseQuestion] = useState<boolean>(false);
  const [reverseAnswer, setReverseAnswer] = useState<boolean>(false);
  const [durationSetting, setDurationSetting] = useState<number | null>(null);

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
      setDurationSetting(data?.duration);
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

  const handlePressStart = () => {
    // navigation.navigate('PracticeExamDetailScreen', { exam: exam });
    navigation.navigate("ExamDoScreen", { examId: examId + '' });
  }

  /* --------------------------------------------------------------
     Các callback được truyền xuống SettingExam
   -------------------------------------------------------------- */
  const handleModeChange = useCallback(
    (mode: "TIMED" | "UNLIMITED") => {
      if (mode === "UNLIMITED") {
        setDurationSetting(null);
      } else {
        setDurationSetting(examInfo?.duration ?? null);
      }
    },
    [examInfo]
  );

  console.log("loanhtm examInfo: ", examInfo);

  return (
    <View style={styles.container}>
      <Header
        data={examInfo}
        title="Chi tiết đề thi"
      />
      <ScrollView>
        <View style={styles.content}>
          <ShortInfoExam
            exam={examInfo}
          />
          <SettingExam
            examInfo={examInfo}
            reverseQuestion={reverseQuestion}
            reverseAnswer={reverseAnswer}
            durationSetting={durationSetting}
            setReverseQuestion={setReverseQuestion}
            setReverseAnswer={setReverseAnswer}
            setDurationSetting={setDurationSetting}
            onModeChange={handleModeChange}
          />
          <InstructionDoExam />
          <View style={styles.actionContainer}>
            <ButtonCustom
              type="primary"
              name="Bắt đầu"
              image={Icons.ArrowStartIcon}
              styleImage={{ width: 24, height: 24, marginRight: 8 }}
              paddingVertical={12}
              onPress={handlePressStart}
            />
          </View>
        </View>
      </ScrollView >

    </View >

  );
}

export default PracticeExamSettingScreen;
