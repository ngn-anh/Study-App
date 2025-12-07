import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./ProfileCard.styles";

interface ProfileCardProps {
  name: string;
  email: string;
  classLevel: string;
  avatarUrl: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, classLevel, avatarUrl }) => (
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

export default ProfileCard;
