import React from "react";
import { styles } from "./SubjectList.styles";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Class, Subject } from "../../types/typeObj";

// const subjects = [
//   {
//     id: "1",
//     name: "Tin học",
//     image: require("../../assets/icons/computer.png"),
//     description: `
//       Bộ đề được biên soạn theo chuẩn chương trình mới nhất

//       📘 20 đề thi

//       - Đề gồm 22 câu hỏi, chia thành 3 phần:
//       + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
//       + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
//       + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

//       - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

//       - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

//       - Môn Tin học là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
//       `,
//   },
//   {
//     id: "2",
//     name: "Ngữ Văn",
//     image: require("../../assets/icons/book.png"),
//     description: `
//       Bộ đề được biên soạn theo chuẩn chương trình mới nhất

//       📘 20 đề thi

//       - Đề gồm 22 câu hỏi, chia thành 3 phần:
//       + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
//       + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
//       + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

//       - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

//       - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

//       - Môn Ngữ Văn là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
//       `,
//   },
//   {
//     id: "3",
//     name: "Toán",
//     image: require("../../assets/icons/math.png"),
//     description: `
//       Bộ đề được biên soạn theo chuẩn chương trình mới nhất

//       📘 20 đề thi

//       - Đề gồm 22 câu hỏi, chia thành 3 phần:
//       + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
//       + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
//       + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

//       - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

//       - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

//       - Môn Toán là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
//       `,
//   },
//   {
//     id: "4",
//     name: "Tiếng Anh",
//     image: require("../../assets/icons/english.png"),
//     description: `
//       Bộ đề được biên soạn theo chuẩn chương trình mới nhất

//       📘 20 đề thi

//       - Đề gồm 22 câu hỏi, chia thành 3 phần:
//       + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
//       + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
//       + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

//       - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

//       - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

//       - Môn Tiếng Anh là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
//       `,
//   },
//   {
//     id: "5",
//     name: "Địa lý",
//     image: require("../../assets/icons/map.png"),
//     description: `
//       Bộ đề được biên soạn theo chuẩn chương trình mới nhất

//       📘 20 đề thi

//       - Đề gồm 22 câu hỏi, chia thành 3 phần:
//       + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
//       + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
//       + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

//       - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

//       - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

//       - Môn Địa lý là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
//       `,
//   },
//   {
//     id: "6",
//     name: "Vật Lý",
//     image: require("../../assets/icons/math.png"),
//     description: `
//       Bộ đề được biên soạn theo chuẩn chương trình mới nhất

//       📘 20 đề thi

//       - Đề gồm 22 câu hỏi, chia thành 3 phần:
//       + Phần 1 gồm 12 câu hỏi trắc nghiệm. Mỗi câu có 4 phương án chọn 1 đáp án đúng.
//       + Phần 2 gồm 4 câu hỏi ở dạng Đúng/Sai.
//       + Phần 3 gồm 6 câu hỏi dạng trả lời ngắn.

//       - Các câu hỏi thuộc 3 cấp độ: Nhận biết - Thông hiểu - Vận dụng theo tỉ lệ 45% - 35% - 25%.

//       - Với định hướng mới, học sinh cần thay đổi cách học, tập trung rèn luyện tư duy logic, năng lực giải quyết vấn đề.

//       - Môn Vật Lý là môn học quan trọng nên cần phân bổ thời gian hợp lý để đạt hiệu quả cao nhất.
//       `,
//   },
// ];

// type NavigationProps = NativeStackNavigationProp<RootStackParamList, "SubjectList">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface props {
  subjects: Subject[];
  classInfo?: Class | null;
}

const SubjectList = (props: props) => {
  const { subjects, classInfo } = props;

  const navigation = useNavigation<NavigationProps>();

  const renderItem = ({ item }: { item: Subject }) => (
    // <View style={styles.item}>
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('PracticeExamScreen', { subjectId: item.id, subjectCode: item.code, classCode: classInfo?.code, classId: classInfo?.id })}
    >
      <Image source={{ uri: item.image }} style={styles.icon} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
    // </View >
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tự luyện</Text>
        <Image source={require("../../assets/icons/filter.png")} style={styles.filterIcon} />
      </View>

      {/* Horizontal list */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: 35 }} />} // khoảng cách giữa các item
      />
    </View>
  );
};

export default SubjectList;
