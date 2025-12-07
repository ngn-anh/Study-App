export const a = '2';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeftIcon,
  BellIcon,
  UserCircleIcon,
  PencilSimpleIcon,
  QuestionIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
  SignOutIcon
} from 'phosphor-react-native';
import { styles } from './ProfileScreen.styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { updateAvatar } from '../../api/user';
import { getClasses, ClassItem } from '../../api/class';
import { UpdateProfileModal } from '../../components/UpdateProfileModal';


interface UserType {
  username: string;
  email: string;
  phone?: string;
  full_name?: string;
  avatar?: string;
}

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<UserType>({
    username: '',
    email: '',
    phone: '',
    full_name: '',
    avatar: '',
  });

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  // Load danh sách lớp
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.log('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Load user data từ AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser(userData.user); // 
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);


  const handleLogout = () => setLogoutModalVisible(true);

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await AsyncStorage.removeItem('userData');
    navigation.reset({ index: 0, routes: [{ name: 'AuthScreen' }] });
  };


  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.7,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const pickedImageUri = response.assets[0].uri;

          // Update local state
          setUser(prev => ({ ...prev, avatar: pickedImageUri }));

          // Update server
          try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (!userDataStr) return;
            const userData = JSON.parse(userDataStr);

            console.log(userData.user.id, pickedImageUri)

            await updateAvatar({
              user_id: userData.user.id,
              avatar: pickedImageUri || "",
            });

            // Update AsyncStorage
            const updatedUserData = {
              ...userData,
              user: { ...userData.user, avatar: pickedImageUri },
            };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
          } catch (error) {
            console.log('Error updating avatar:', error);
          }
        }
      }
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon size={20} color="#083070" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
        </View>
      </View>

      {/* Logout Modal */}
      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
          <View style={styles.customModal}>
            <View style={styles.modalContent}>
              <SignOutIcon size={36} color="#FF3B30" weight="bold" style={{ marginBottom: 10 }} />
              <Text style={styles.modalMessage}>Bạn có chắc muốn đăng xuất?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={{ color: '#000', fontWeight: '600' }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#FF3B30' }]}
                  onPress={confirmLogout}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Đăng xuất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  'https://cdn-icons-png.flaticon.com/512/219/219969.png',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton} onPress={handlePickImage}>
              <PencilSimpleIcon size={14} color="#fff" weight="bold" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user.full_name || user.username}</Text>
          <Text style={styles.email}>
            {user.email} {user.phone ? `| ${user.phone}` : ''}
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => setModalProfileVisible(true)}>
            <UserCircleIcon size={22} color="#083070" weight="bold" />
            <Text style={styles.label}>Cập nhật hồ sơ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <BellIcon size={22} color="#083070" weight="bold" />
            <Text style={styles.label}>Thông báo</Text>
            <Text style={styles.badge}>ON</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <KeyIcon size={22} color="#083070" weight="bold" />
            <Text style={styles.label}>Đổi mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <SignOutIcon size={22} color="#FF3B30" weight="bold" />
            <Text style={styles.label}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <QuestionIcon size={22} color="#083070" weight="bold" />
            <Text style={styles.label}>Hỗ trợ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <EnvelopeSimpleIcon size={22} color="#083070" weight="bold" />
            <Text style={styles.label}>Liên hệ chúng tôi</Text>
          </TouchableOpacity>
        </View>

        <UpdateProfileModal
          visible={modalProfileVisible}
          onClose={() => setModalProfileVisible(false)}
          user={user}
          classes={classes}
          onProfileUpdated={(updatedUser: any) => setUser(updatedUser)}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
