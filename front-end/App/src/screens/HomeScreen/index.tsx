import React from "react";
import { SafeAreaView, View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { styles } from "./HomeScreen.styles";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import SubjectList from "../../components/SubjectList/SubjectList";
import ExamCard from "../../components/ExamCard/ExamCard";
import LinearGradient from "react-native-linear-gradient";
import ExamList from "../../components/ExamList/ExamList";


const HomeScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={["#170A66", "#3169a8ff","#fff"]}
      locations={[0, 0.8, 1]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.option}>
               <Image
                source={require("../../assets/icons/option.png")}
                style={styles.bellIcon}
              />
              <Text style={styles.username}>Nguyễn Thị Thu Ngân</Text>
            </View>
            <TouchableOpacity style={styles.notification}>
              <Image
                source={require("../../assets/icons/bell.png")}
                style={styles.bellIcon}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>24</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <ProfileCard
            name="Ngân Cute"
            email="thungan16092003@gmail.com"
            classLevel="Lớp 11"
            avatarUrl="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          />

          {/* Subject section */}
          <SubjectList />

         {/* Exam section */}
          <View style={styles.examSection}>
            <ExamList />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
