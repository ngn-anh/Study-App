export const a='1';
export const getRemainingTime = (dueDateStr: string, dueTimeStr: string) => {
  const now = new Date();

  // Parse due_date UTC từ DB
  const dueDateUTC = new Date(dueDateStr); // 2025-11-05T00:00:00Z

  // Tạo dueDate local
  const [hours, minutes] = dueTimeStr.split(':').map(Number);
  const dueDate = new Date(
    dueDateUTC.getUTCFullYear(),
    dueDateUTC.getUTCMonth(),
    dueDateUTC.getUTCDate(),
    hours,
    minutes,
    0,
    0
  );

  console.log('dueDate',dueDateUTC.getUTCFullYear(),
    dueDateUTC.getUTCMonth(),
    dueDateUTC.getUTCDate())

  let diff = dueDate.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      text: 'Đã hết hạn',
      expired: true,
      color: '#888888',
      bgColor: '#F7F9FC',
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;

  const hrs = Math.floor(diff / (1000 * 60 * 60));
  diff -= hrs * 1000 * 60 * 60;

  const mins = Math.floor(diff / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ngày`);
  if (hrs > 0) parts.push(`${hrs} giờ`);
  if (mins > 0) parts.push(`${mins} phút`);

  const text = parts.length > 0 ? `Còn ${parts.join(' ')}` : 'Còn ít hơn 1 phút';

  return {
    text,
    expired: false,
    color: '#00B42A',
    bgColor: '#E5F7E9',
  };
};


export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};