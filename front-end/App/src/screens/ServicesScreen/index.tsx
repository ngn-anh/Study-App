import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnreadNotificationCount } from '../../api/notification';

interface ServiceItemProps {
  icon: React.ElementType;
  label: string;
  badgeCount?: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon: Icon, label, badgeCount = 0 }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (label === "Lịch hẹn") {
      navigation.navigate("ScheduleScreen" as never);
    }  else if (label === "Thi thử") {
      navigation.navigate("ExamListScreen" as never);
    } else if (label === "Luyện đề") {
      navigation.navigate("PracticeExam" as never);
    } else if (label === "Thông báo") {
      navigation.navigate("NotificationScreen" as never);
    }
  };
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.iconWrapper}>
        <Icon size={36} color="#0066FF" weight="duotone" />
        {badgeCount > 0 && (
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
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("userData");
        if (!userDataStr) return;
        const userData = JSON.parse(userDataStr);
        const count = await getUnreadNotificationCount(userData.user.id);
        setUnreadCount(count);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PlanetIcon size={22} color="#083070" weight="duotone" />
          <Text style={styles.headerTitle}>Dịch vụ</Text>
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
        <ServiceItem icon={AlarmIcon} label="Lịch hẹn"/>
        <ServiceItem icon={BellIcon} label="Thông báo" badgeCount={unreadCount} />
      </View>
    </ScrollView>
  );
};

export default ServicesScreen;
