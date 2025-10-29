import { Dimensions, PixelRatio } from "react-native";

/**
 * Thiết lập màn hình gốc (theo thiết kế Figma)
 * Ví dụ: nếu thiết kế Figma là iPhone 14 Pro (390x844)
 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale theo chiều ngang (width)
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale theo chiều dọc (height)
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Scale kích thước trung bình (thường dùng cho fontSize)
 * @param size kích thước gốc (Figma)
 * @param factor tỉ lệ điều chỉnh, mặc định 0.5
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Scale fontSize có tính đến mật độ điểm ảnh (Pixel Ratio)
 */
export const fontScale = (size: number): number => {
  return PixelRatio.getFontScale() * moderateScale(size);
};
