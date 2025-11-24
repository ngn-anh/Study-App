import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    containerPrimary: {
        backgroundColor: "#0C4299",
        borderRadius: 50,
    },
    containerSecondary: {
        borderRadius: 50,
        borderColor: "#0C4299",
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
    },

    containerDisable: {
        borderRadius: 50,
        borderColor: "#a2a0b3ff",
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
    },
    name: {
        fontSize: 12,
        textAlign: 'center',
    },
    namePrimary: {
        color: "#FFFFFF",
    },
    nameSecondary: {
        color: '#1900ffff',
    },
    nameDisable: {
        color: '#a2a0b3ff',
    }
});