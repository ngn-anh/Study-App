import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { HouseIcon, PlanetIcon, UserIcon } from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const height = 70;

const CurvedTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isMiddle = route.name === 'Trang chủ';

          let IconComponent: any = HouseIcon;
          if (route.name === 'Dịch vụ') IconComponent = PlanetIcon;
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

          // 🎨 Màu khi chưa active / active
          const inactiveColor = '#A0A0A0'; // Xám
          const activeColor = '#0066FF'; // Xanh

          const iconColor = isMiddle
            ? '#fff'
            : isFocused
            ? activeColor
            : inactiveColor;

          const textColor = isMiddle
            ? '#fff'
            : isFocused
            ? activeColor
            : inactiveColor;

          const weight = isMiddle || isFocused ? 'fill' : 'regular';

          return (
           <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabButton, isMiddle && styles.middleButton]}
              activeOpacity={0.8}
            >
              {isMiddle ? (
                <View style={styles.innerCircle}>
                  <IconComponent weight="fill" color="#fff" size={28} />
                </View>
              ) : (
                <>
                  <IconComponent
                    weight={weight}
                    color={iconColor}
                    size={24}
                  />
                  <Text style={[styles.label, { color: textColor }]}>{route.name}</Text>
                </>
              )}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width,
    height,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleButton: {
    marginTop: -45,
  justifyContent: 'center',
  alignItems: 'center',

  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },

  innerCircle: {
    width: 80,           // nhỏ hơn
    height: 70,          // nhỏ hơn
    borderRadius: 40,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
},

});

export default CurvedTabBar;
