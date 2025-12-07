export const a = '1';
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

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamSettingScreen'>;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const PracticeExamSettingScreen = (props: Props) => {
  const { route } = props;
  const { exam } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const handlePressStart = () => {
    // navigation.navigate('PracticeExamDetailScreen', { exam: exam });
    navigation.navigate("ExamDoScreen", {
      examId: exam?.id + ''
    });
  }

  return (
    <View style={styles.container}>
      <Header
        data={exam}
        title="Chi tiết đề thi"
      />
      <ScrollView>
        <View style={styles.content}>
          {/* <View style={styles.infoExamContainer}>
            <Image source={{ uri: exam?.image }} style={styles.imageExam} />
            <Text style={styles.nameExam}>{exam?.name ?? ''}</Text>
            <View style={styles.infoExam}>
              <View style={styles.infoExamLeft}>
                <View style={styles.itemLeft}>
                  <QuestionIcon style={styles.itemIcon} />
                  <Text style={styles.itemValue}>{exam?.number + ""}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <ClockIcon style={styles.itemIcon} />
                  <Text style={styles.itemValue}>{exam?.number + ""}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <CalendarDotsIcon style={styles.itemIcon} />
                  <Text style={styles.itemValue}>{exam?.number + ""}</Text>
                </View>
              </View>
              <View style={styles.infoExamRight}>
                <View style={styles.itemRight}>
                  <Text style={styles.itemValueRight}>100</Text>
                  <Text style={styles.itemDesRight}>Lượt thi</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemValueRight}>50</Text>
                  <Text style={styles.itemDesRight}>Lượt thích</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemValueRight}>2</Text>
                  <Text style={styles.itemDesRight}>Lượt tải</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <ButtonCustom
              type="primary"
              name="Bắt đầu"
              onPress={handlePressStart}
            />
          </View>
          <View style={styles.previewExamContainer}>

          </View> */}
          <ShortInfoExam
            exam={exam}
          />
          <SettingExam />
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
