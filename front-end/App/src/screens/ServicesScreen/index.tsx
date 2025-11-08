import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  ExamIcon,
  PlanetIcon,
  StudentIcon,
  BookOpenIcon,
  ListChecksIcon,
  BellIcon,
  AlarmIcon,
  MapTrifoldIcon,
  AppWindowIcon,
} from 'phosphor-react-native';
import { styles } from './ServicesScreen.styles';
import { useNavigation } from '@react-navigation/native';

interface ServiceItemProps {
  icon: React.ElementType;
  label: string;
  badgeCount?: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon: Icon, label, badgeCount }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (label === "Lịch hẹn") {
      navigation.navigate("ScheduleScreen" as never);
    }  else if (label === "Thi thử") {
      navigation.navigate("ExamListScreen" as never);
    } else if (label === "Luyện đề") {
      navigation.navigate("PracticeExam" as never);
    }
  };
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.iconWrapper}>
        <Icon size={36} color="#0066FF" weight="duotone" />
        {badgeCount && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const ServicesScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PlanetIcon size={22} color="#083070" weight="duotone" />
          <Text style={styles.headerTitle}>Dịch vụ</Text>
        </View>

        <View style={styles.headerBadge}>
          <BellIcon size={22} color="#1669EF" weight="fill" />
          <View style={styles.headerBadgeDot}>
            <Text style={styles.headerBadgeText}>26</Text>
          </View>
        </View>
      </View>

      {/* Nhóm Tính năng */}
      <Text style={styles.sectionTitle}>Tính năng</Text>
      <View style={styles.grid}>
        <ServiceItem icon={ExamIcon} label="Thi thử" />
        <ServiceItem icon={MapTrifoldIcon} label="Lộ trình học" />
        <ServiceItem icon={ListChecksIcon} label="Bảng xếp hạng" />
        <ServiceItem icon={BookOpenIcon} label="Luyện đề" />
      </View>

      {/* Nhóm Cài đặt */}
      <Text style={styles.sectionTitle}>Cài đặt</Text>
      <View style={styles.grid}>
        <ServiceItem icon={StudentIcon} label="Lập kế hoạch học" />
        <ServiceItem icon={AlarmIcon} label="Lịch hẹn" badgeCount={2} />
        <ServiceItem icon={BellIcon} label="Thông báo" badgeCount={12} />
      </View>
    </ScrollView>
  );
};

export default ServicesScreen;
