import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ExamCard from "../ExamCard/ExamCard";
import { Exam, User } from "../../types/typeObj";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { useNavigation } from "@react-navigation/native";

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

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
interface props {
  exams: Exam[];
  user?: User | null;
  onToggleLike: (examId: string, currentlyLiked: number) => void;
}

const ExamList = (props: props) => {
  const { exams, user, onToggleLike } = props;

  const navigation = useNavigation<NavigationProps>();

  const onPressButton = (item: Exam) => {
    if (item.is_done) {
      navigation.navigate("ExamResultScreen", {
        examId: item._id,
        userId: user?.id || '',
      });
    } else {
      navigation.navigate("ExamInfoScreen", {
        examId: item._id,
      });
    }
  }

  const renderItem = ({ item }: { item: Exam }) => (
    <ExamCard
      key={item._id}
      exam={item}
      onPressLike={() => onToggleLike(item._id, item.is_liked ?? 0)}
      onPressButton={onPressButton}
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
