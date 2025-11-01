import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TrashIcon } from "phosphor-react-native";
import { styles } from "./index.styles";

interface DeleteModalProps {
  visible: boolean;
  title: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  content,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header: Icon + Title */}
          <View style={styles.header}>
            <TrashIcon size={24} color="#E53935" weight="fill" />
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          <Text style={styles.content}>{content}</Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};