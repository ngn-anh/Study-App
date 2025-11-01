import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { CaretLeftIcon, CalendarBlankIcon, ClockIcon } from "phosphor-react-native";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";

type RouteProps = RouteProp<RootStackParamList, "CreateUpdateSchedule">;

const mockData = [
  {
    id: "1",
    title: "Lịch kiểm tra giữa kỳ 1",
    dueDate: "2025-11-07T12:00:00",
    remindDate: "2025-11-06T08:00:00",
    repeat: "Hàng ngày",
    note: "Học hành chăm chỉ bạn sẽ có tất cả...",
  },
  {
    id: "2",
    title: "Lịch thi thử đợt 1",
    dueDate: "2025-11-10T09:00:00",
    remindDate: "2025-11-09T07:00:00",
    repeat: "Hàng tuần",
    note: "Hãy ôn luyện kỹ trước khi thi!",
  },
];

const formatDate = (date: Date) =>
  `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

const CreateUpdateScheduleScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const { id } = route.params || {};

  const [form, setForm] = useState({
    title: "",
    dueDate: new Date(),
    remindDate: new Date(),
    repeat: "Không lặp",
    note: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    dueDate: "",
    remindDate: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [pickerType, setPickerType] = useState<"dueDate" | "dueTime" | "remindDate" | "remindTime" | null>(null);
  const [isRepeatDaily, setIsRepeatDaily] = useState(false);

  useEffect(() => {
    if (id) {
      const found = mockData.find((x) => x.id === id);
      if (found) {
        setForm({
          title: found.title,
          dueDate: new Date(found.dueDate),
          remindDate: new Date(found.remindDate),
          repeat: found.repeat,
          note: found.note,
        });
        setIsRepeatDaily(found.repeat === "Hàng ngày");
      }
    }
  }, [id]);

  // =================== Validation Realtime ===================
  useEffect(() => {
    const newErrors = { title: "", dueDate: "", remindDate: "" };
    const now = new Date();
    let hasError = false;

    if (!form.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề.";
      hasError = true;
    }

    if (form.dueDate < now) {
      newErrors.dueDate = "Ngày đến hạn phải lớn hơn hoặc bằng hiện tại.";
      hasError = true;
    }

    if (!isRepeatDaily && form.remindDate >= form.dueDate) {
      newErrors.remindDate = "Ngày nhắc phải nhỏ hơn ngày đến hạn.";
      hasError = true;
    }

    setErrors(newErrors);
    setIsValid(!hasError);
  }, [form, isRepeatDaily]);

  const handleSave = () => {
    if (isValid) {
      console.log(id ? "Cập nhật lịch:" : "Tạo mới lịch:", form);
      navigation.goBack();
    }
  };

  const updateForm = (type: typeof pickerType, selectedDate: Date) => {
    const newForm = { ...form };
    if (type === "dueDate") {
      const newDate = new Date(form.dueDate);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      newForm.dueDate = newDate;
    } else if (type === "dueTime") {
      const newDate = new Date(form.dueDate);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      newForm.dueDate = newDate;
    } else if (type === "remindDate") {
      const newDate = new Date(form.remindDate);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      newForm.remindDate = newDate;
    } else if (type === "remindTime") {
      const newDate = new Date(form.remindDate);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      newForm.remindDate = newDate;
    }
    setForm(newForm);
  };

  const openPicker = (type: typeof pickerType) => {
    if (type === "remindDate" && isRepeatDaily) return; // disable nếu lặp hằng ngày

    if (Platform.OS === "android") {
      const current = type?.includes("due") ? form.dueDate : form.remindDate;
      const mode = type?.includes("Date") ? "date" : "time";

      DateTimePickerAndroid.open({
        value: current,
        onChange: (_event, selectedDate) => {
          if (selectedDate) updateForm(type, selectedDate);
        },
        mode,
        is24Hour: true,
      });
    } else {
      setPickerType(type);
    }
  };

  const getPickerValue = () => (pickerType?.includes("due") ? form.dueDate : form.remindDate);
  const getPickerMode = () => (pickerType?.includes("Date") ? "date" : "time");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeftIcon size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch hẹn</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        {/* Tiêu đề */}
        <Text style={styles.label}>
          <Text style={{ color: "red" }}>* </Text>Tiêu đề:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Vui lòng nhập tiêu đề"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
        />
        {errors.title ? <Text style={{ color: "red", marginTop: 4 }}>{errors.title}</Text> : null}

        {/* Ngày đến hạn */}
        <Text style={styles.label}>
          <Text style={{ color: "red" }}>* </Text>Ngày đến hạn:
        </Text>
        <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("dueDate")}>
          <Text style={styles.inputText}>{formatDate(form.dueDate)}</Text>
          <CalendarBlankIcon size={20} color="#275BAE" />
        </TouchableOpacity>
        {errors.dueDate ? <Text style={{ color: "red", marginTop: 4 }}>{errors.dueDate}</Text> : null}

        {/* Thời gian đến hạn */}
        <Text style={styles.label}>
          <Text style={{ color: "red" }}>* </Text>Thời gian đến hạn:
        </Text>
        <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("dueTime")}>
          <Text style={styles.inputText}>{formatTime(form.dueDate)}</Text>
          <ClockIcon size={20} color="#275BAE" />
        </TouchableOpacity>

        {/* Ngày nhắc */}
        <Text style={styles.label}>
          <Text style={{ color: "red" }}>* </Text>Ngày nhắc:
        </Text>
        <TouchableOpacity
          style={[styles.inputRow, isRepeatDaily && { opacity: 0.5 }]}
          disabled={isRepeatDaily}
          onPress={() => openPicker("remindDate")}
        >
          <Text style={styles.inputText}>{formatDate(form.remindDate)}</Text>
          <CalendarBlankIcon size={20} color="#275BAE" />
        </TouchableOpacity>
        {errors.remindDate ? <Text style={{ color: "red", marginTop: 4 }}>{errors.remindDate}</Text> : null}

        {/* Thời gian nhắc */}
        <Text style={styles.label}>
          <Text style={{ color: "red" }}>* </Text>Thời gian nhắc:
        </Text>
        <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("remindTime")}>
          <Text style={styles.inputText}>{formatTime(form.remindDate)}</Text>
          <ClockIcon size={20} color="#275BAE" />
        </TouchableOpacity>

        {/* Lặp lại hằng ngày */}
        <Text style={styles.label}>Lặp lại hằng ngày:</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputText}>{isRepeatDaily ? "Bật" : "Tắt"}</Text>
          <Switch
            value={isRepeatDaily}
            onValueChange={(val) => {
              setIsRepeatDaily(val);
              setForm({ ...form, repeat: val ? "Hàng ngày" : "Không lặp" });
            }}
            trackColor={{ false: "#ccc", true: "#0C4299" }}
            thumbColor="#fff"
          />
        </View>

        {/* Ghi chú */}
        <Text style={styles.label}>Ghi chú:</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={form.note}
          placeholder="Nhập ghi chú tại đây"
          onChangeText={(text) => setForm({ ...form, note: text })}
        />

        {/* Lưu */}
        <TouchableOpacity
          style={[styles.saveButton, !isValid && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!isValid}
        >
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>

      {Platform.OS === "ios" && pickerType && (
        <DateTimePicker
          value={getPickerValue()!}
          mode={getPickerMode()!}
          is24Hour
          display="spinner"
          onChange={(_e, selectedDate) => {
            if (selectedDate) updateForm(pickerType, selectedDate);
          }}
        />
      )}
    </View>
  );
};

export default CreateUpdateScheduleScreen;
