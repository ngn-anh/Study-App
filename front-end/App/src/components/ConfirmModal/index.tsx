import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styles } from "./index.styles";

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  type?: 'warning' | 'confirm';
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "",
  content = "",
  cancelText = "Hủy",
  confirmText = "Xác nhận",
  onCancel = () => {},
  onConfirm = () => {},
  type = "confirm",
}) => {
  const mainColor = type === "warning" ? "#ff1c1cff" : "#083070";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { borderColor: mainColor }]}>
          <Text style={[styles.title, { color: mainColor }]}>{title}</Text>
          <Text style={styles.content}>{content}</Text>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.cancelBtn, { borderColor: mainColor }]}
            >
              <Text style={[styles.cancelText, { color: mainColor }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.confirmBtn, { backgroundColor: mainColor }]}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
