import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./index.styles";
import { ArrowLeftIcon, CaretLeft, HouseIcon, NoteIcon, TrophyIcon } from "phosphor-react-native";

export const ExamResultScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
              <CaretLeft size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết Quả Thi</Text>
        </View>
        <View style={styles.resultBadge}>
          <Text style={styles.resultText}>Đúng 20/25</Text>
        </View>
      </View>

      {/* Buttons */}
      <LinearGradient colors={["#0C4299", "#041633"]} style={styles.button}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate("MainTabs" as never)}
        >
          <View style={styles.buttonContent}>
            <HouseIcon size={22} color="#fff" />
            <Text style={styles.buttonText}>Trang Chủ</Text>
          </View>
          <ArrowLeftIcon size={20} color="#fff" style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={["#0C4299", "#041633"]} style={styles.button}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate("ExamDetailResultScreen" as never)}
        >
          <View style={styles.buttonContent}>
            <NoteIcon size={22} color="#fff" />
            <Text style={styles.buttonText}>Chi Tiết Kết Quả</Text>
          </View>
          <ArrowLeftIcon size={20} color="#fff" style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={["#0C4299", "#041633"]} style={styles.button}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate("ExamRankScreen" as never)}
        >
          <View style={styles.buttonContent}>
            <TrophyIcon size={22} color="#fff" />
            <Text style={styles.buttonText}>Chi Tiết Bảng Xếp Hạng Bài Thi</Text>
          </View>
          <ArrowLeftIcon size={20} color="#fff" style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
