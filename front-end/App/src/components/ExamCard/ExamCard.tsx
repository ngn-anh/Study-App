import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./ExamCard.styles";

interface ExamCardProps {
  title: string;
  subject: string;
  imageUrl: string;
  likes: number;
  comments: number;
  done?: boolean; // trạng thái đã làm/chưa
  onPressButton?: () => void;
}

const ExamCard: React.FC<ExamCardProps> = ({
  title,
  subject,
  imageUrl,
  likes,
  comments,
  done = false,
  onPressButton,
}) => {
  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        {/* Header: title + subject */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.subjectTag}>
            <Text style={styles.subjectText}>{subject}</Text>
          </View>
        </View>

        {/* Likes + Comments */}
        <View style={styles.iconInfo}>
          <View style={styles.iconGroup}>
            <Image source={require("../../assets/icons/group.png")} style={styles.icon} />
            <Text style={styles.iconText}>{comments}</Text>
          </View>
          <View style={styles.iconGroup}>
            <Image source={require("../../assets/icons/like.png")} style={styles.icon} />
            <Text style={styles.iconText}>{likes}</Text>
          </View>
        </View>

        {/* Footer: buttons */}
        <View style={styles.footerRow}>
          <View style={styles.iconRow}>
            <View style={styles.iconGroupLink}>
              <Image source={require("../../assets/icons/like.png")} style={styles.iconLink} />
              <Text style={styles.linkText}>Thích</Text>
            </View>
            <View style={styles.iconGroupLink}>
              <Image source={require("../../assets/icons/share.png")} style={styles.iconLink} />
              <Text style={styles.linkText}>Chia sẻ</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressButton}
            style={[
              styles.button,
              { backgroundColor: done ? "#6B57BE" : "#22A112" },
            ]}
          >
            <Text style={styles.buttonText}>{done ? "Xem kết quả" : "Vào thi"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ExamCard;
