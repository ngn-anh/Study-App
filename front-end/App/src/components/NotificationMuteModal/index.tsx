// src/components/NotificationMuteModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';

interface NotificationMuteModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (minutes: number | null) => void;
}

const NotificationMuteModal: React.FC<NotificationMuteModalProps> = ({
  visible,
  onClose,
  onSelectOption,
}) => {
  const options = [
    { label: '30 phút', minutes: 1 },
    { label: '1 giờ', minutes: 60 },
    { label: '4 giờ', minutes: 240 },
    { label: 'Đến khi bật lại', minutes: null },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Tắt thông báo trong bao lâu ?</Text>
          {options.map(option => (
            <TouchableOpacity
              key={option.label}
              style={styles.optionButton}
              onPress={() => onSelectOption(option.minutes)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default NotificationMuteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#083070',
  },
  optionButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 15,
    color: '#09295cff',
  },
});
