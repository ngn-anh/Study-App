// NotificationScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CaretRight, Megaphone, BookOpen, Bell, CaretLeft } from "phosphor-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { styles } from "./index.styles";
import { RootStackParamList } from "../../types/data";

const NotificationScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const data = [
    { id: 1, icon: Megaphone, title: "Khuyến mãi", description: "Bạn có 5 thông tin về khuyến mãi." },
    { id: 2, icon: BookOpen, title: "Khóa học", description: "Bạn có 5 thông tin về khóa học." },
    { id: 3, icon: Bell, title: "Nhắc nhở", description: "Bạn có 5 nhắc nhở. Đừng bỏ qua nhé!", badge: 5 },
  ];

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.reset({
                        index: 0,
                        routes: [
                        {
                            name: "MainTabs",
                            state: {
                            index: 0, // chọn tab Service
                            routes: [
                                { name: "Service" },
                                { name: "Home" },
                                { name: "Profile" },
                            ],
                            },
                        },
                        ],
                    })}>
                    <CaretLeft size={20} color="#083070" weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
            </View>
        </View>
        <View  style={styles.componentCard}>
            {data.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate("NotificationListScreen", { type: item.title })
                    }
                >
                    <View style={styles.iconWrapper}>
                        <item.icon size={24} color="#1669EF" weight="duotone" />
                    </View>
                    <View style={styles.textWrapper}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <View style={styles.rightWrapper}>
                        {item.badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                        )}
                        <CaretRight size={20} color="#1669EF" />
                    </View>
                </TouchableOpacity>
            ))}
        </View>           
    </ScrollView>
  );
};

export default NotificationScreen;
