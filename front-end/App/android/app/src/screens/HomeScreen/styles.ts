import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>Nguyễn Thị Thu Ngân</Text>
            <Text style={styles.class}>Lớp 12A1</Text>
          </View>
        </View>
        <Icon name="notifications" size={28} color="#fff" />
      </View>

      {/* Tự luyện */}
      <View style={styles.practiceBox}>
        <Text style={styles.sectionTitle}>Tự luyện</Text>
        <View style={styles.practiceRow}>
          {['Thi thử', 'Ôn tập', 'Kết quả', 'Xếp hạng'].map((item, index) => (
            <TouchableOpacity key={index} style={styles.practiceItem}>
              <Icon name="school" size={24} color="#0066FF" />
              <Text style={styles.practiceText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Card Thi thử gần đây */}
      <View style={styles.examCard}>
        <Image
          source={{ uri: 'https://picsum.photos/400/200' }}
          style={styles.examImage}
        />
        <View style={styles.examInfo}>
          <Text style={styles.examTitle}>Thi thử Giải đề Số 2</Text>
          <Text style={styles.examDesc}>Cập nhật ngày 22/10/2025</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { color: '#fff', fontSize: 16, fontWeight: '600' },
  class: { color: '#E0ECFF', fontSize: 13 },
  practiceBox: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  practiceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  practiceItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: 70,
    elevation: 2,
  },
  practiceText: { marginTop: 5, fontSize: 12, color: '#333' },
  examCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  examImage: { width: '100%', height: 160 },
  examInfo: { padding: 15 },
  examTitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  examDesc: { color: '#666', marginBottom: 10 },
  startButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  startText: { color: '#fff', fontWeight: '600' },
});
