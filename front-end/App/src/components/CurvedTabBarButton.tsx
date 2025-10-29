import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  onPress: () => void;
  iconName: string;
  label: string;
  focused: boolean;
}

const CurvedTabBarButton: React.FC<Props> = ({ onPress, iconName, label, focused }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.curveContainer}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={[
            styles.button,
            { backgroundColor: focused ? '#0066FF' : '#fff' },
          ]}
        >
          <AntDesign
            name={iconName}
            size={28}
            color={focused ? '#fff' : '#0066FF'}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.label, focused && { color: '#0066FF' }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  curveContainer: {
    top: -30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 6,
  },
  label: {
    fontSize: 12,
    color: '#797979ff',
    marginTop: -10,
  },
});

export default CurvedTabBarButton;
