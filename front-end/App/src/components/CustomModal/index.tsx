import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './index.styles';
import { CheckCircleIcon, WarningCircleIcon } from 'phosphor-react-native';

interface Props {
  visible: boolean;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const CustomModal: React.FC<Props> = ({ visible, message, onClose, type = 'success' }) => {
  return (
   <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={[styles.container]}>
        <View style={styles.messageWrapper}>
          {type === 'error' ? (
            <WarningCircleIcon size={24} color="#dc3545" weight="bold" />
          ) : (
            <CheckCircleIcon size={24} color="#28a745" weight="bold" />
          )}
          <Text style={styles.text}>{message}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, type === 'error' ? styles.errorButton : styles.successButton]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};