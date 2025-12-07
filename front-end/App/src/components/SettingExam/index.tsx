/* --------------------------------------------------------------
   SettingExam – Cho phép người dùng chọn chế độ thi
   (giới hạn thời gian / không giới hạn) và bật/tắt 2 tùy chọn
   thiết lập đề thi.
   -------------------------------------------------------------- */
import React, { memo, useState } from "react";
import { styles } from "./index.styles";
import {
    View,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    Image,
} from "react-native";
import { Icons } from "../../constants/icons";

/* -------------------------- Types --------------------------- */
enum ExamMode {
    Timed = "TIMED",
    Unlimited = "UNLIMITED",
}

/** Các tùy chọn "cài đặt đề thi". */
interface ExamSettings {
    shuffleQuestions: boolean; // Tự động đảo câu hỏi
    shuffleAnswers: boolean; // Tự động đảo câu trả lời
}

/** Props mà component nhận vào. */
interface Props {
    /** Giá trị mặc định của mode – nếu không truyền sẽ mặc định là Timed. */
    defaultMode?: ExamMode;
    /** Giá trị mặc định cho các setting – nếu không truyền sẽ mặc định là false. */
    defaultSettings?: ExamSettings;
    /** Callback khi người dùng thay đổi mode. */
    onModeChange?: (mode: ExamMode) => void;
    /** Callback khi thay đổi một trong các setting. */
    onSettingsChange?: (settings: ExamSettings) => void;
}

/* ----------------------------------------------------------- */
const SettingExam = memo(
    ({
        defaultMode = ExamMode.Timed,
        defaultSettings = { shuffleQuestions: false, shuffleAnswers: false },
        onModeChange,
        onSettingsChange,
    }: Props) => {
        /* -------------------------- State -------------------------- */
        const [mode, setMode] = useState<ExamMode>(defaultMode);
        const [settings, setSettings] = useState<ExamSettings>(defaultSettings);

        /* ------------------- Android animation ------------------- */
        // LayoutAnimation cho Android (đổi màu, expand) mượt hơn
        if (
            Platform.OS === "android" &&
            UIManager.setLayoutAnimationEnabledExperimental
        ) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        /* ----------------------- Handlers ----------------------- */
        const handleSelectMode = (newMode: ExamMode) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setMode(newMode);
            onModeChange?.(newMode);
        };

        const toggleSetting = (key: keyof ExamSettings) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const newVal = !settings[key];
            const newSettings = { ...settings, [key]: newVal };
            setSettings(newSettings);
            onSettingsChange?.(newSettings);
        };

        /* --------------------------- UI --------------------------- */
        return (
            <View style={styles.container}>
                {/* ---------- ① Chế độ thi (2 options) ---------- */}
                <Text style={styles.sectionTitle}>CHỌN CHẾ ĐỘ</Text>
                <View style={styles.modeGroup}>
                    {/* ---- Thi giới hạn thời gian ---- */}
                    <TouchableOpacity
                        style={[
                            styles.modeItem,
                            mode === ExamMode.Timed && styles.modeItemActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleSelectMode(ExamMode.Timed)}
                        accessibilityRole="button"
                        accessibilityLabel="Thi giới hạn thời gian"
                    >
                        <Image
                            source={Icons.AlarmClockIcon}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text
                            style={[
                                styles.modeText,
                                mode === ExamMode.Timed && styles.modeTextActive,
                            ]}
                        >
                            Thi giới hạn thời gian
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.modeItem,
                            mode === ExamMode.Unlimited && styles.modeItemActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleSelectMode(ExamMode.Unlimited)}
                        accessibilityRole="button"
                        accessibilityLabel="Thi không giới hạn thời gian"
                    >
                        <Image
                            source={Icons.NotAlarmClockIcon}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text
                            style={[
                                styles.modeText,
                                mode === ExamMode.Unlimited && styles.modeTextActive,
                            ]}
                        >
                            Thi không giới hạn thời gian
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Cài đặt đề thi</Text>
                <View style={styles.settingGroup}>
                    <TouchableOpacity
                        style={styles.settingItem}
                        activeOpacity={0.7}
                        onPress={() => toggleSetting("shuffleQuestions")}
                    >
                        {settings.shuffleQuestions ? (
                            <Image
                                source={Icons.CheckSquareInlineIcon}
                                style={{ width: 20, height: 20 }}
                            />
                        ) : (
                            // <CheckSquare size={20} color="#0C4299" weight="fill" />
                            <Image
                                source={Icons.SquareInlineIcon}
                                style={{ width: 20, height: 20 }}
                            />
                            // <Square size={20} color="#888" weight="regular" />
                        )}
                        <Text style={styles.settingText}>Tự động đảo câu hỏi</Text>
                    </TouchableOpacity>

                    {/* Tự động đảo câu trả lời */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        activeOpacity={0.7}
                        onPress={() => toggleSetting("shuffleAnswers")}
                    >
                        {settings.shuffleAnswers ? (
                            <Image
                                source={Icons.CheckSquareInlineIcon}
                                style={{ width: 20, height: 20 }}
                            />
                        ) : (
                            // <CheckSquare size={20} color="#0C4299" weight="fill" />
                            <Image
                                source={Icons.SquareInlineIcon}
                                style={{ width: 20, height: 20 }}
                            />
                            // <Square size={20} color="#888" weight="regular" />
                        )}
                        <Text style={styles.settingText}>Tự động đảo câu trả lời</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
);

export default SettingExam;
