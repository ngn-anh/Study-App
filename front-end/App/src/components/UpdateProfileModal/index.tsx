import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateProfile, UpdateProfilePayload } from '../../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './index.styles';

export interface ClassItem {
  _id: string;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  user: any;
  classes: ClassItem[];
  onProfileUpdated: (updatedUser: any) => void;
}

export const UpdateProfileModal: React.FC<Props> = ({
  visible,
  onClose,
  user,
  classes,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [emailField, setEmailField] = useState(user.email || '');
  const [phoneField, setPhoneField] = useState(user.phone || '');
  const [classId, setClassId] = useState(user.class_id || '');

  useEffect(() => {
    setFullName(user.full_name || '');
    setEmailField(user.email || '');
    setPhoneField(user.phone || '');
    setClassId(user.class_id || '');
  }, [user]);

  const handleSave = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) return;
      const userData = JSON.parse(userDataStr);

      const payload: UpdateProfilePayload = {
        user_id: userData.user.id,
        full_name: fullName,
        email: emailField,
        phone: phoneField ,
        class_id: classId,
      };

      const updatedUser = await updateProfile(payload);

      // Update AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify({ ...userData, user: updatedUser }));

      onProfileUpdated(updatedUser);
      onClose();
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.customModal}>
          <Text style={styles.modalTitle}>Cập nhật hồ sơ</Text>

          <Text style={styles.label}>Họ và tên</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={emailField} onChangeText={setEmailField} />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput style={styles.input} value={phoneField} onChangeText={setPhoneField} />

          <Text style={styles.label}>Lớp</Text>
          <View style={styles.selectWrapper}>
            <Picker selectedValue={classId} onValueChange={setClassId} style={styles.picker}>
              <Picker.Item label="-- Chọn lớp --" value="" style={styles.pickerItem} />
              {classes?.map((c) => (
                <Picker.Item key={c?._id} label={c?.name} value={c?._id}  style={styles.pickerItem}/>
              ))}
            </Picker>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonCancel} onPress={onClose}>
              <Text style={styles.modalButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonSave} onPress={handleSave}>
              <Text style={styles.modalButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
