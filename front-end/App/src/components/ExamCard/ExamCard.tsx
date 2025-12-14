import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./ExamCard.styles";
import { Exam } from "../../types/typeObj";

interface ExamCardProps {
  exam?: Exam | null;
  onPressLike?: () => void;
  onPressButton: (item: Exam) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onPressLike,
  onPressButton,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: exam?.image }} style={styles.image} />

      <View style={styles.content}>
        {/* Header: title + subject */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{exam?.name}</Text>
          <View style={styles.subjectTag}>
            <Text style={styles.subjectText}>{exam?.subject?.name}</Text>
          </View>
        </View>

        {/* Likes + Comments */}
        <View style={styles.iconInfo}>
          <View style={styles.iconGroup}>
            <Image source={require("../../assets/icons/group.png")} style={styles.icon} />
            <Text style={styles.iconText}>{exam?.participants}</Text>
          </View>
          <View style={styles.iconGroup}>
            <Image source={require("../../assets/icons/like.png")} style={styles.icon} />
            <Text style={styles.iconText}>{exam?.total_like}</Text>
          </View>
        </View>

        {/* Footer: buttons */}
        <View style={styles.footerRow}>
          <View style={styles.iconRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressLike}
              style={styles.iconGroupLink}
            >
              <Image
                source={
                  (exam?.is_liked == 1)
                    ? require("../../assets/icons/like.png") // <--- thêm ảnh này
                    : require("../../assets/icons/like.png")
                }
                style={[
                  styles.iconLink,
                  { tintColor: (exam?.is_liked == 1) ? "#1669EF" : "#555" },
                ]}
              />
              <Text
                style={[
                  styles.linkText,
                  { color: (exam?.is_liked == 1) ? "#1669EF" : "#555" },
                ]}
              >
                {(exam?.is_liked == 1) ? "Đã thích" : "Thích"}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconGroupLink}>
              <Image source={require("../../assets/icons/share.png")} style={styles.iconLink} />
              <Text style={styles.linkText}>Chia sẻ</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => exam && onPressButton(exam)}
            style={[
              styles.button,
              { backgroundColor: exam?.is_done ? "#6B57BE" : "#22A112" },
            ]}
          >
            <Text style={styles.buttonText}>{exam?.is_done ? "Xem kết quả" : "Vào thi"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ExamCard;
