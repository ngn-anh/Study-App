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
import { createSchedule, getScheduleDetail, updateSchedule } from "../../api/reminderSchedules";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RouteProps = RouteProp<RootStackParamList, "CreateUpdateSchedule">;

const formatDate = (date: Date) =>
  `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

const CreateUpdateScheduleScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const { id,name, due_date } = route.params || {};

  const [form, setForm] = useState({
    title: name || "",
    dueDate: due_date ? new Date(due_date) : new Date(),
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
  const [isDirty, setIsDirty] = useState(false);
  const [pickerType, setPickerType] = useState<"dueDate" | "dueTime" | "remindDate" | "remindTime" | null>(null);
  const [isRepeatDaily, setIsRepeatDaily] = useState(false);

  // ===== Load dữ liệu khi edit =====
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getScheduleDetail(id);

        const dueDate = new Date(data.due_date);
        const [dueHour, dueMinute] = data.due_time.split(":").map(Number);
        dueDate.setHours(dueHour, dueMinute, 0, 0);

        const remindDate = new Date(data.remind_date);
        const [remindHour, remindMinute] = data.remind_time.split(":").map(Number);
        remindDate.setHours(remindHour, remindMinute, 0, 0);

        setForm({
          title: data.title,
          dueDate,
          remindDate,
          repeat: data.repeat_mode === "daily" ? "Hàng ngày" : "Không lặp",
          note: data.note || "",
        });

        setIsRepeatDaily(data.repeat_mode === "daily");
      } catch (error) {
        console.error("Load schedule error:", error);
      }
    };

    fetchData();
  }, [id]);

  // ===== Validation Realtime =====
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

  // ===== Khi người dùng thay đổi form =====
  const handleChange = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true); // đánh dấu đã thay đổi
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
    setIsDirty(true);
  };

  // ===== Open picker =====
  const openPicker = (type: typeof pickerType) => {
    if (type === "remindDate" && isRepeatDaily) return;

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

  // ===== Save =====
  const handleSave = async () => {
    if (!isValid) return;

    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);
      const pad = (num: number) => num.toString().padStart(2, "0");

      const payload = {
        user_id: userData.user.id,
        title: form.title,
        note: form.note,
        due_date: `${form.dueDate.getFullYear()}-${pad(form.dueDate.getMonth() + 1)}-${pad(form.dueDate.getDate())}`,
        due_time: `${pad(form.dueDate.getHours())}:${pad(form.dueDate.getMinutes())}`,
        remind_date: `${form.remindDate.getFullYear()}-${pad(form.remindDate.getMonth() + 1)}-${pad(form.remindDate.getDate())}`,
        remind_time: `${pad(form.remindDate.getHours())}:${pad(form.remindDate.getMinutes())}`,
        repeat_mode: isRepeatDaily ? "daily" : "none",
      };

      if (id) {
        console.log(id, payload)
        await updateSchedule(id, payload);
      } else {
        await createSchedule(payload);
      }

      if (name && due_date) {
    // ✅ Quay về màn ExamListScreen và gửi flag
        navigation.navigate("ExamListScreen", { showSuccessModal: true });
      } else {
        navigation.navigate("ScheduleScreen")
      }

      
    } catch (error) {
      console.error("Lưu lịch hẹn lỗi:", error);
    }
  };

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
          onChangeText={(text) => handleChange("title", text)}
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
              setForm(prev => ({ ...prev, repeat: val ? "Hàng ngày" : "Không lặp" }));
              setIsDirty(true);
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
          onChangeText={(text) => handleChange("note", text)}
        />

        {/* Lưu */}
        <TouchableOpacity
          style={[styles.saveButton, (!isValid || !isDirty) && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!isValid || !isDirty}
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
