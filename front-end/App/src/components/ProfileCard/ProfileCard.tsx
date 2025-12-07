export const a = '2';
import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./ProfileCard.styles";
import { Class, UserInfo } from "../../types/typeObj";
import { IMAGE_DEFAULT } from "../../constants/images";

interface ProfileCardProps {
  user: UserInfo | null;
  classInfo: Class | null;
  // name: string;
  // email: string;
  // classLevel: string;
  // avatarUrl: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, classInfo }) => {

  const name = user?.full_name || user?.username || 'User';
  const email = user?.email;
  const classLevel = classInfo?.name;
  const avatarUrl = user?.avatar || IMAGE_DEFAULT.AVATAR;

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{classLevel}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;
