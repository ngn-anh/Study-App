import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import {
  ArrowLeftIcon,
  FadersHorizontalIcon,
  BellIcon,
  UserCircleIcon,
  PencilSimpleIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeIcon,
  QuestionIcon,
  EnvelopeSimpleIcon,
  LockIcon,
  KeyIcon,
  SignOutIcon
} from 'phosphor-react-native';
import { styles } from './ProfileScreen.styles';

const ProfileScreen = ({ navigation }: any) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleChangePassword = () => {
    setMenuVisible(false);
    console.log('Đổi mật khẩu');
  };

  const handleLogout = () => {
    setMenuVisible(false);
    console.log('Đăng xuất');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon size={24} color="#083070" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <TouchableOpacity onPress={toggleMenu}>
          <FadersHorizontalIcon size={24} color="#083070" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdownWrapper}>
            <View style={styles.dropdownMenu}>
              <Pressable style={styles.dropdownItem} onPress={handleChangePassword}>
                <KeyIcon size={18} color="#000" weight="bold" />
                <Text style={styles.dropdownText}>Đổi mật khẩu</Text>
              </Pressable>
              <View style={styles.dropdownDivider} />
              <Pressable style={styles.dropdownItem} onPress={handleLogout}>
                <SignOutIcon size={18} color="#FF3B30" weight="bold" />
                <Text style={[styles.dropdownText, { color: '#FF3B30' }]}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/219/219969.png' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <PencilSimpleIcon size={14} color="#fff" weight="bold" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Laiba Ahmar</Text>
          <Text style={styles.email}>youremail@domain.com | +01 234 567 89</Text>
        </View>

        {/* Section 1 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <UserCircleIcon size={22} color="#083070" />
            <Text style={styles.label}>Edit profile information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <BellIcon size={22} color="#083070" />
            <Text style={styles.label}>Notifications</Text>
            <Text style={styles.badge}>ON</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <GlobeIcon size={22} color="#083070" />
            <Text style={styles.label}>Language</Text>
            <Text style={styles.badge}>English</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <ShieldCheckIcon size={22} color="#083070" />
            <Text style={styles.label}>Security</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <PaintBrushIcon size={22} color="#083070" />
            <Text style={styles.label}>Theme</Text>
            <Text style={styles.badge}>Light mode</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <QuestionIcon size={22} color="#083070" />
            <Text style={styles.label}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <EnvelopeSimpleIcon size={22} color="#083070" />
            <Text style={styles.label}>Contact us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <LockIcon size={22} color="#083070" />
            <Text style={styles.label}>Privacy policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
