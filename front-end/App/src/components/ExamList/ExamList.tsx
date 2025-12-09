import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ExamCard from "../ExamCard/ExamCard";
import { Exam } from "../../types/typeObj";

// const exams = [
//   {
//     id: "1",
//     title: "Thi thử giữa kì 1",
//     subject: "Ngữ Văn",
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTrtoLahxdSx-nthMqeQ3NAV2pDTsiLIPIeQ&s",
//     likes: 26,
//     comments: 0,
//     done: true, // đã làm
//   },
//   {
//     id: "2",
//     title: "Thi thử giữa kì 1",
//     subject: "Toán",
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu8SWcmi08WDjNTnuRLwbauI2yLZL4r9QRsA&s",
//     likes: 15,
//     comments: 3,
//     done: false, // chưa làm
//   },
//   {
//     id: "3",
//     title: "Thi thử giữa kì 1",
//     subject: "Anh Văn",
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1BvVT5T8cI0WeYzKWoaw-uW-VlqKpfe3WVw&s",
//     likes: 10,
//     comments: 1,
//     done: false,
//   },
// ];

interface props {
  exams: Exam[];
  onToggleLike: (examId: string, currentlyLiked: number) => void;
}

const ExamList = (props: props) => {
  const { exams, onToggleLike } = props;
  const renderItem = ({ item }: { item: typeof exams[0] }) => (
    <ExamCard
      key={item._id}
      title={item.name}
      subject={item.subject}
      imageUrl={item.image}
      likes={item.total_like}
      participants={item.participants}
      done={item.is_done} // truyền trạng thái đã làm
      isLiked={item.is_liked === 1}
      onPressLike={() => onToggleLike(item._id, item.is_liked ?? 0)}
      onPressButton={() =>
        console.log(item.is_done ? `Xem kết quả ${item.name}` : `Vào thi ${item.name}`)
      }
    />
  );

  return (
    <FlatList
      data={exams}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={{ width: 20 }} />} // khoảng cách giữa card
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
  },
});

export default ExamList;
