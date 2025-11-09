import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { styles } from "./index.styles";
import ExpandDesSubject from "../../components/ExpandDesSubject";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import Header from "../../components/Header";
import SearchBar from "../../components/Search";
import ItemExam from "../../components/ItemExam";
import { verticalScale } from "../../utils/responsive";
import { ClockIcon } from "phosphor-react-native";

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamDetailScreen'>;
};

const PracticeExamDetailScreen = (props: Props) => {
  const { route } = props;
  const { exam } = route.params;
  console.log(">>>>>");
  console.log("loanhtm exam detail: ", exam);
  const listExam: any[] = [
    {
      id: "1",
      image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 1",
      number: 50,
      duration: 120,
      createdAt: "2023-11-05T10:00:00Z",
      difficulty: 3
    },
    {
      id: "2",
      image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 2",
      number: 40,
      duration: 90,
      createdAt: "2023-11-06T14:30:00Z",
      difficulty: 2
    },
    {
      id: "3",
      image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 3",
      number: 30,
      duration: 60,
      createdAt: "2023-11-05T09:15:00Z",
      difficulty: 4
    },
    {
      id: "4",
      image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 4",
      number: 50,
      duration: 120,
      createdAt: "2023-11-03T11:45:00Z",
      difficulty: 3
    },
    {
      id: "5",
      image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 5",
      number: 45,
      duration: 100,
      createdAt: "2023-11-02T08:00:00Z",
      difficulty: 5
    }
  ]

  const renderItemExam = ({ item }: any) => {
    const isSingleItem = listExam.length === 1;
    return (
      <View style={{ flex: isSingleItem ? 1 : 0.5 }}>
        <ItemExam exam={item} />
      </View>
    );
  };

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
                  <ClockIcon style={styles.itemIcon} />
                  <Text style={styles.itemValue}>{exam?.number + ""}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <ClockIcon style={styles.itemIcon} />
                  <Text style={styles.itemValue}>{exam?.number + ""}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <ClockIcon style={styles.itemIcon} />
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

          </View>
          <View style={styles.previewExamContainer}>

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
