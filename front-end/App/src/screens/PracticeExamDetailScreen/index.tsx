import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
// import Header from "../../components/Header";
// import ItemExam from "../../components/ItemExam";
import { verticalScale } from "../../utils/responsive";
import { CalendarDotsIcon, ClockIcon, FileArrowDownIcon, QuestionIcon, ShareFatIcon } from "phosphor-react-native";
// import ButtonCustom from "../../components/ButtonCustom";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icons } from "../../constants/icons";
import ButtonCustom from "../../components/ButtonCustom/index";
import { useState } from "react";
import PreviewExam from "../../components/PreviewExam/index";
import HistoryExamUser from "../../components/HistoryExamUser/index";
import Header from "../../components/Header/index";
import { formatDate } from "../../utils/time";

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamDetailScreen'>;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

enum TabKey {
  Preview = "preview", // Xem trước
  History = "history", // Lịch sử thi
}

const PracticeExamDetailScreen = (props: Props) => {
  const { route } = props;
  const { exam } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const fileNamePdf = `${exam?.name ?? ''}.pdf`;
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.Preview);

  const handlePressDoExam = () => {
    navigation.navigate('PracticeExamSettingScreen', { exam: exam });
  };

  const onSelectTab = (tab: TabKey) => () => setActiveTab(tab);

  return (
    <View style={styles.container}>
      <Header
        data={exam}
        title="Chi tiết đề thi"
      />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.infoExamContainer}>
            <Image source={{ uri: exam?.image }} style={styles.imageExam} />
            <Text style={styles.nameExam}>{exam?.name ?? ''}</Text>
            <View style={styles.infoExam}>
              <View style={styles.infoExamLeft}>
                <View style={styles.itemLeft}>
                  <QuestionIcon color="#000000" />
                  <Text style={styles.itemValue}>{exam?.number + " câu"}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <ClockIcon color="#000000" />
                  <Text style={styles.itemValue}>{exam?.duration + " phút"}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <CalendarDotsIcon color="#000000" />
                  <Text style={styles.itemValue}>{formatDate(exam?.createdAt + "")}</Text>
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
                  {fileNamePdf}
                </Text>
              </View>
              <View style={styles.downloadShare}>
                <View style={styles.action}>
                  {/* <Image source={Icons.DownloadPdfIcon} style={styles.downloadShareIcon} /> */}
                  <FileArrowDownIcon style={{ width: 14, height: 18 }} color="#FFFFFF" weight="bold" />
                </View>
                <View style={styles.action}>
                  {/* <Image source={Icons.ShareOutlineIcon} style={styles.downloadShareIcon} /> */}
                  <ShareFatIcon style={{ width: 18, height: 15 }} color="#FFFFFF" weight="bold" />
                </View>
              </View>
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
              <PreviewExam exam={exam} />
            ) : (
              <HistoryExamUser exam={exam} />
            )}
          </View>
        </View>
        {/* <SearchBar />
        <FlatList
          data={listExam}
          renderItem={renderItemExam}
          keyExtractor={(item) => item.id}
          numColumns={2} // Hiển thị 2 item trên mỗi hàng
          columnWrapperStyle={{ justifyContent: 'space-between' }} // Căn giữa các item
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop: verticalScale(20) }} // Thêm khoảng cách cho các item
        /> */}
      </ScrollView >
    </View >

  );
}

export default PracticeExamDetailScreen;
