import RNFetchBlob from 'react-native-blob-util';
import { Platform } from 'react-native';
import { API_URL } from '@env';

export const downloadExamPdf = async (
  examId: string,
  name: string,
  token?: string,
) => {
  const { fs } = RNFetchBlob;

  const dir =
    Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir;

  const path = `${dir}/${name}.pdf`;

  try {
    const res = await RNFetchBlob.config({
      fileCache: true,
      path,
      appendExt: 'pdf',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path,
        description: 'Đang tải đề thi PDF',
        mime: 'application/pdf',
        title: name,
      },
    }).fetch(
      'GET',
      `${API_URL}/download-pdf/exam/${examId}/pdf`,
      token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    );

    console.log('Thành công', 'Đã tải đề thi PDF');

    return res.path();
  } catch (error) {
    console.error(error);
    console.log('Lỗi không tải được đề thi');
  }
};

export const previewExamPdf = async (
  examId: string,
  name?: string,
  token?: string,
) => {
  const { fs } = RNFetchBlob;

  // file tạm
  const path = `${fs.dirs.CacheDir}/${name}.pdf`;

  const res = await RNFetchBlob.config({
    fileCache: true,
    path,
    appendExt: 'pdf',
  }).fetch(
    'GET',
    `${API_URL}/download-pdf/exam/${examId}/preview`,
    token ? { Authorization: `Bearer ${token}` } : undefined,
  );

  return res.path();
};
