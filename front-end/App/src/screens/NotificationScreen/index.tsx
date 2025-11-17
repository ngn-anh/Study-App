import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { CaretRight, CaretLeft, Megaphone, BookOpen, Bell } from "phosphor-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { styles } from "./index.styles";
import { RootStackParamList } from "../../types/data";
import { getNotificationTypes } from "../../api/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const iconMap: Record<string, any> = {
  SALE: Megaphone,
  LESSON: BookOpen,
  REMINDER: Bell,
};

const NotificationScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [notificationTypes, setNotificationTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);

      const res = await getNotificationTypes(userData.user.id);
      setNotificationTypes(res);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "MainTabs",
                    state: {
                      index: 0,
                      routes: [
                        { name: "Service" },
                        { name: "Home" },
                        { name: "Profile" },
                      ],
                    },
                  },
                ],
              })
            }
          >
            <CaretLeft size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông báo</Text>
        </View>
      </View>

      {/* Nội dung */}
      <View style={styles.componentCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#1669EF" style={{ marginTop: 40 }} />
        ) : (
          notificationTypes.map((item) => {
            const IconComponent = iconMap[item.code] || Bell;

            return (
              <TouchableOpacity
                key={item._id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("NotificationListScreen", { type: item.code })
                }
              >
                <View style={styles.iconWrapper}>
                  <IconComponent size={24} color="#1669EF" weight="duotone" />
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                </View>
                <View style={styles.rightWrapper}>
                    {item.unread_count >0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.unread_count}</Text>
                    </View>
                    )}
                  <CaretRight size={20} color="#1669EF" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;
