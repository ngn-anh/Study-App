import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CommonModalProps {
  visible: boolean;
  title: string;
  content: string;
  cancelText?: string;
  okText?: string;
  handleCancel?: () => void;
  handleOk?: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  title,
  content,
  cancelText = 'Hủy',
  okText = 'Đồng ý',
  handleCancel,
  handleOk,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.okButton]} onPress={handleOk}>
              <Text style={styles.okText}>{okText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.4)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#23AC11',
    textAlign: 'left',
    marginBottom: 20,
  },
  content: {
    fontSize: 13,
    color: '#081834',
    textAlign: 'left',
    marginBottom: 25,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // lệch sang phải
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6DAE1',
  },
  okButton: {
    backgroundColor: '#23AC11',
    borderWidth: 1,
    borderColor:'#23AC11'
  },
  cancelText: {
    color: '#081834',
    fontWeight: '500',
  },
  okText: {
    color: '#fff',
    fontWeight: '500',
  },
});
