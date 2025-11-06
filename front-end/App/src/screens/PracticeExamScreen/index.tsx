import { FlatList, ScrollView, Text, View } from "react-native";
import { styles } from "./index.styles";
import ExpandDesSubject from "../../components/ExpandDesSubject";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import Header from "../../components/Header";
import SearchBar from "../../components/Search";
import ItemExam from "../../components/ItemExam";
import { Exam } from "../../types/typeObj";

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamScreen'>;
};

const PracticeExamScreen = (props: Props) => {
  const { route } = props;
  const { subject } = route.params;

  const listExam: any[] = [
    {
      id: "1",
      image: "https://example.com/images/exam1.jpg",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 1",
      number: 50,
      duration: 120,
      createdAt: "2023-11-05T10:00:00Z",
      difficulty: 3
    },
    {
      id: "2",
      image: "https://example.com/images/exam2.jpg",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 2",
      number: 40,
      duration: 90,
      createdAt: "2023-11-06T14:30:00Z",
      difficulty: 2
    },
    {
      id: "3",
      image: "https://example.com/images/exam3.jpg",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 3",
      number: 30,
      duration: 60,
      createdAt: "2023-11-05T09:15:00Z",
      difficulty: 4
    },
    {
      id: "4",
      image: "https://example.com/images/exam4.jpg",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 4",
      number: 50,
      duration: 120,
      createdAt: "2023-11-03T11:45:00Z",
      difficulty: 3
    },
    {
      id: "5",
      image: "https://example.com/images/exam5.jpg",
      name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 5",
      number: 45,
      duration: 100,
      createdAt: "2023-11-02T08:00:00Z",
      difficulty: 5
    }
  ]

  // const renderItemExam = ({ item }: { item: Exam }) => (
  const renderItemExam = ({ item }: any) => (
    <ItemExam exam={item} />
  );

  // const renderItemExam = ({ item }) => {
  //   const isSingleItem = listExam.length === 1; // Kiểm tra nếu chỉ có 1 item
  //   return (
  //     <View style={{ flex: isSingleItem ? 1 : 0.5 }}> {/* Chiếm toàn bộ chiều rộng nếu chỉ có 1 item */}
  //       <ItemExam exam={item} />
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      <Header data={subject} />
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Làm chủ môn {subject?.name}</Text>
          <ExpandDesSubject text={subject?.description.trim() || ''} numberOfLines={5} />
        </View>
      </ScrollView>
      <SearchBar />
      <FlatList
        data={listExam}
        renderItem={renderItemExam}
        keyExtractor={(item) => item.id}
        numColumns={2} // Hiển thị 2 item trên mỗi hàng
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Căn giữa các item
        contentContainerStyle={{ paddingHorizontal: 10 }} // Thêm khoảng cách cho các item
      />
    </View>
  );
}

export default PracticeExamScreen;
