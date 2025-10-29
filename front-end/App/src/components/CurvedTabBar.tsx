import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HouseIcon, AppStoreLogoIcon , UserIcon } from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const height = 70;

const CurvedTabBar = ({ state, descriptors, navigation }: any) => {

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          let IconComponent: any = HouseIcon;
          if (route.name === 'Dịch vụ') IconComponent = AppStoreLogoIcon ;
          else if (route.name === 'Trang chủ') IconComponent = HouseIcon;
          else if (route.name === 'Hồ sơ') IconComponent = UserIcon;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isMiddle = route.name === 'Trang chủ';

          // Màu icon + weight khi active
          const iconColor = isMiddle || isFocused ? "#fff" : "#0066FF";
          const weight = isFocused || isMiddle ? "fill" : "regular";

          const textColor = isMiddle || isFocused ? "#fff" : "#0066FF";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabButton, isMiddle && styles.middleButton]}
              activeOpacity={0.8}
            >
              <IconComponent
                weight={weight}
                color={iconColor}
                size={isMiddle ? 30 : 24}
              />
              <Text style={[styles.label, { color: textColor }]}>{route.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    width,
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    bottom: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width,
    height,
    backgroundColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleButton: {
    marginTop: -25,
    backgroundColor: '#0066FF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CurvedTabBar;
