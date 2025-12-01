// Regex bỏ dấu
export function removeAccentsRegex(str: string) {
  const accentsMap: any = {
    a: 'aáàảãạăắằẳẵặâấầẩẫậ',
    e: 'eéèẻẽẹêếềểễệ',
    i: 'iíìỉĩị',
    o: 'oóòỏõọôốồổỗộơớờởỡợ',
    u: 'uúùủũụưứừửữự',
    y: 'yýỳỷỹỵ',
    d: 'dđ',
  };

  let result = '';

  for (const char of str.toLowerCase()) {
    const key = Object.keys(accentsMap).find(k => accentsMap[k].includes(char));
    if (key) {
      result += `[${accentsMap[key]}]`;
    } else {
      result += char;
    }
  }

  return result;
}