import RNFetchBlob from 'react-native-blob-util';
import { PermissionsAndroid, Platform } from 'react-native';
import { API_URL } from '@env';

export const downloadExamPdf = async (examId: string, name: string) => {
  const { fs } = RNFetchBlob;
  if (Platform.OS === 'android' && Platform.Version < 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.error('Không có quyền lưu file');
    }
  }
  const safeName = name.replace(/[\/\\:*?"<>|]/g, '_');
  const downloadPath = `${fs.dirs.DownloadDir}/${safeName}.pdf`;

  try {
    await RNFetchBlob.config({
      // fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: downloadPath,
        title: `${safeName}.pdf`,
        description: 'Đang tải đề thi PDF',
        mime: 'application/pdf',
        mediaScannable: true,
      },
    }).fetch('GET', `${API_URL}/download-pdf/exam/${examId}/pdf`);
    console.log('loanhtm downloadPath: ', downloadPath);
    return downloadPath;
  } catch (error) {
    console.error('Không tải được đề thi', error);
  }
};

export const previewExamPdf = async (examId: string, name?: string) => {
  const { fs } = RNFetchBlob;

  // file tạm
  const path = `${fs.dirs.CacheDir}/${name}.pdf`;

  const res = await RNFetchBlob.config({
    fileCache: true,
    path,
    appendExt: 'pdf',
  }).fetch('GET', `${API_URL}/download-pdf/exam/${examId}/preview`);

  return res.path();
};
