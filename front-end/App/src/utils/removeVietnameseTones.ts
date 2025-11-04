export const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD") // tách ký tự dấu
    .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
