// // services/pdfService.ts
// import RNFetchBlob from 'rn-fetch-blob';
// import Share from 'react-native-share';
// import { Platform, Alert } from 'react-native';
// import { PermissionsAndroid } from 'react-native';

// interface PDFDownloadOptions {
//     showAlert?: boolean;
//     showNotification?: boolean;
//     openAfterDownload?: boolean;
//     shareAfterDownload?: boolean;
// }

// interface PDFPreviewOptions {
//     downloadFirst?: boolean;
//     useBrowser?: boolean;
// }

// // Thêm vào sau các interface hiện có
// interface AppShareOptions {
//     appName?: string;
//     playStoreLink?: string;
//     appStoreLink?: string;
//     website?: string;
//     deepLinkBase?: string;
// }

// interface DeepLinkOptions {
//     examId: string;
//     examName: string;
//     examInfo?: any;
//     userInfo?: any;
// }

// class PDFService {
//     private API_BASE_URL: string = "http://localhost:3000"; // Thay bằng URL API của bạn

//     // constructor(baseUrl?: string) {
//     //     if (baseUrl) {
//     //         this.API_BASE_URL = baseUrl;
//     //     }
//     // }

//     // /**
//     //  * Đặt base URL cho API
//     //  */
//     // setBaseUrl(baseUrl: string) {
//     //     this.API_BASE_URL = baseUrl;
//     // }

//     /**
//      * Kiểm tra và yêu cầu quyền trên Android
//      */
//     private async requestStoragePermission(): Promise<boolean> {
//         if (Platform.OS !== 'android') {
//             return true;
//         }

//         try {
//             // Kiểm tra quyền WRITE_EXTERNAL_STORAGE
//             const writeGranted = await PermissionsAndroid.check(
//                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//             );

//             if (writeGranted) {
//                 return true;
//             }

//             // Yêu cầu quyền
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//                 {
//                     title: 'Quyền truy cập bộ nhớ',
//                     message: 'Ứng dụng cần quyền để lưu file PDF',
//                     buttonNeutral: 'Hỏi sau',
//                     buttonNegative: 'Từ chối',
//                     buttonPositive: 'Đồng ý',
//                 }
//             );

//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (error) {
//             console.error('Lỗi khi yêu cầu quyền:', error);
//             return false;
//         }
//     }

//     /**
//      * Tạo tên file PDF từ tên đề thi
//      */
//     private generateFileName(examName: string): string {
//         const timestamp = Date.now();
//         const safeName = examName
//             .replace(/[^a-zA-Z0-9À-ỹ\s]/g, '')
//             .replace(/\s+/g, '_')
//             .substring(0, 50); // Giới hạn độ dài
//         return `${safeName}_${timestamp}.pdf`;
//     }

//     /**
//      * Lấy đường dẫn thư mục lưu file
//      */
//     private getDownloadPath(fileName: string): string {
//         if (Platform.OS === 'android') {
//             return `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
//         } else {
//             return `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;
//         }
//     }

//     /**
//      * Tải file PDF từ server
//      */
//     private async downloadFile(
//         url: string,
//         path: string,
//         options: PDFDownloadOptions = {}
//     ): Promise<string> {
//         const { showNotification = true } = options;

//         const configOptions = Platform.select({
//             ios: {
//                 fileCache: true,
//                 path: path,
//                 appendExt: 'pdf',
//             },
//             android: {
//                 fileCache: true,
//                 addAndroidDownloads: {
//                     useDownloadManager: true,
//                     notification: showNotification,
//                     path: path,
//                     description: 'Đang tải file PDF',
//                     mediaScannable: true,
//                     mime: 'application/pdf',
//                 },
//             },
//         });

//         const response = await RNFetchBlob.config(configOptions)
//             .fetch('GET', url, {
//                 'Content-Type': 'application/pdf',
//                 'Accept': 'application/pdf',
//             });

//         return response.path();
//     }

//     /**
//      * Mở file PDF
//      */
//     async openPDF(filePath: string, fileName: string, examName?: string): Promise<void> {
//         try {
//             if (Platform.OS === 'ios') {
//                 // iOS: sử dụng Share để mở với app mặc định
//                 await Share.open({
//                     url: `file://${filePath}`,
//                     type: 'application/pdf',
//                     filename: fileName,
//                     title: examName ? `Mở PDF: ${examName}` : 'Mở PDF',
//                 });
//             } else {
//                 // Android: mở bằng intent
//                 RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
//             }
//         } catch (error: any) {
//             console.error('Lỗi mở PDF:', error);

//             // Không hiển thị lỗi nếu user cancel
//             if (error.message !== 'User did not share') {
//                 throw new Error('Không thể mở file PDF');
//             }
//         }
//     }

//     /**
//      * Chia sẻ file PDF
//      */
//     async sharePDF(filePath: string, fileName: string, examName: string): Promise<void> {
//         try {
//             await Share.open({
//                 url: `file://${filePath}`,
//                 title: `Chia sẻ đề thi: ${examName}`,
//                 type: 'application/pdf',
//                 filename: fileName,
//                 message: `Chia sẻ đề thi: ${examName}`,
//             });
//         } catch (error: any) {
//             // Không hiển thị lỗi nếu user cancel
//             if (error.message !== 'User did not share') {
//                 console.error('Lỗi chia sẻ PDF:', error);
//                 throw new Error('Không thể chia sẻ file');
//             }
//         }
//     }

//     /**
//      * Tải đề thi PDF về máy
//      */
//     async downloadExamPDF(
//         examId: string,
//         examName: string,
//         options: PDFDownloadOptions = {}
//     ): Promise<{ path: string; fileName: string }> {
//         const {
//             showAlert = true,
//             showNotification = true,
//             openAfterDownload = false,
//             shareAfterDownload = false,
//         } = options;

//         try {
//             // Kiểm tra quyền
//             const hasPermission = await this.requestStoragePermission();
//             if (!hasPermission) {
//                 throw new Error('PERMISSION_DENIED');
//             }

//             // Tạo URL và tên file
//             const url = `${this.API_BASE_URL}/download-pdf/exam/${examId}/pdf`;
//             const fileName = this.generateFileName(examName);
//             const path = this.getDownloadPath(fileName);

//             // Tải file
//             const filePath = await this.downloadFile(url, path, { showNotification });

//             // Hiển thị thông báo thành công
//             if (showAlert) {
//                 Alert.alert(
//                     'Thành công',
//                     `PDF đã được tải xuống:\n${fileName}`,
//                     [
//                         { text: 'OK', style: 'cancel' },
//                         ...(openAfterDownload ? [{
//                             text: 'Mở file',
//                             onPress: () => this.openPDF(filePath, fileName, examName)
//                         }] : []),
//                         ...(shareAfterDownload ? [{
//                             text: 'Chia sẻ',
//                             onPress: () => this.sharePDF(filePath, fileName, examName)
//                         }] : []),
//                     ]
//                 );
//             }

//             return { path: filePath, fileName };

//         } catch (error: any) {
//             console.error('Lỗi tải PDF:', error);

//             let errorMessage = 'Không thể tải PDF';
//             let showAlertMessage = true;

//             switch (error.message) {
//                 case 'PERMISSION_DENIED':
//                     errorMessage = 'Quyền truy cập bộ nhớ bị từ chối';
//                     break;
//                 case 'Network request failed':
//                     errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet';
//                     break;
//                 case '404':
//                     errorMessage = 'Không tìm thấy file PDF trên server';
//                     break;
//                 default:
//                     if (error.toString().includes('404')) {
//                         errorMessage = 'Không tìm thấy file PDF trên server';
//                     } else if (error.toString().includes('Network Error')) {
//                         errorMessage = 'Lỗi kết nối mạng';
//                     }
//             }

//             if (showAlert) {
//                 Alert.alert('Lỗi', errorMessage);
//             }

//             throw new Error(errorMessage);
//         }
//     }

//     /**
//      * Xem trước đề thi PDF
//      */
//     async previewExamPDF(
//         examId: string,
//         examName: string,
//         options: PDFPreviewOptions = {}
//     ): Promise<void> {
//         const { downloadFirst = false, useBrowser = false } = options;

//         try {
//             if (downloadFirst || Platform.OS === 'ios') {
//                 // Tải file về trước rồi mở
//                 const { path, fileName } = await this.downloadExamPDF(examId, examName, {
//                     showAlert: false,
//                     showNotification: false,
//                 });

//                 await this.openPDF(path, fileName, examName);
//             } else {
//                 // Mở trực tiếp trong trình duyệt (chỉ Android)
//                 const url = `${this.API_BASE_URL}/download-pdf/exam/${examId}/preview`;
//                 await RNFetchBlob.android.actionViewIntent(url, 'application/pdf');
//             }
//         } catch (error: any) {
//             console.error('Lỗi xem trước PDF:', error);

//             // Fallback: tải về rồi mở
//             if (error.message !== 'User did not share') {
//                 try {
//                     const { path, fileName } = await this.downloadExamPDF(examId, examName, {
//                         showAlert: false,
//                         showNotification: false,
//                     });

//                     await this.openPDF(path, fileName, examName);
//                 } catch (fallbackError) {
//                     throw new Error('Không thể xem trước PDF');
//                 }
//             }
//         }
//     }

//     /**
//      * Chia sẻ đề thi (không cần tải file)
//      */
//     async shareExamInfo(examInfo: {
//         name: string;
//         duration: number;
//         numberQuestion: number;
//         image?: string;
//     }): Promise<void> {
//         try {
//             await Share.share({
//                 title: `Chia sẻ đề thi: ${examInfo.name}`,
//                 message: `Đề thi: ${examInfo.name}\nThời gian: ${examInfo.duration} phút\nSố câu: ${examInfo.numberQuestion}\n\nTải ứng dụng để làm bài thi!`,
//                 url: examInfo.image || undefined,
//             });
//         } catch (error: any) {
//             // Không hiển thị lỗi nếu user cancel
//             if (error.message !== 'User did not share') {
//                 console.error('Lỗi chia sẻ thông tin:', error);
//             }
//         }
//     }

//     /**
//      * Hiển thị menu lựa chọn cho PDF
//      */
//     async showPDFOptions(
//         examId: string,
//         examName: string,
//         examInfo?: any
//     ): Promise<void> {
//         return new Promise((resolve) => {
//             Alert.alert(
//                 'Tải đề thi PDF',
//                 `Chọn hành động cho "${examName}":`,
//                 [
//                     {
//                         text: 'Tải về máy',
//                         onPress: async () => {
//                             try {
//                                 await this.downloadExamPDF(examId, examName, {
//                                     openAfterDownload: false,
//                                     shareAfterDownload: false,
//                                 });
//                             } catch (error) {
//                                 // Đã xử lý lỗi trong downloadExamPDF
//                             }
//                             resolve();
//                         }
//                     },
//                     {
//                         text: 'Tải và mở ngay',
//                         onPress: async () => {
//                             try {
//                                 await this.downloadExamPDF(examId, examName, {
//                                     openAfterDownload: true,
//                                     shareAfterDownload: false,
//                                 });
//                             } catch (error) {
//                                 // Đã xử lý lỗi trong downloadExamPDF
//                             }
//                             resolve();
//                         }
//                     },
//                     {
//                         text: 'Xem trước',
//                         onPress: async () => {
//                             try {
//                                 await this.previewExamPDF(examId, examName);
//                             } catch (error) {
//                                 Alert.alert('Lỗi', 'Không thể xem trước PDF');
//                             }
//                             resolve();
//                         }
//                     },
//                     ...(examInfo ? [{
//                         text: 'Chia sẻ thông tin',
//                         onPress: async () => {
//                             await this.shareExamInfo(examInfo);
//                             resolve();
//                         }
//                     }] : []),
//                     {
//                         text: 'Hủy',
//                         style: 'cancel',
//                         onPress: () => resolve()
//                     },
//                 ]
//             );
//         });
//     }

//     // /**
//     //  * Kiểm tra file PDF đã tồn tại chưa
//     //  */
//     // async checkFileExists(fileName: string): Promise<boolean> {
//     //     try {
//     //         const path = this.getDownloadPath(fileName);
//     //         const exists = await RNFetchBlob.fs.exists(path);
//     //         return exists;
//     //     } catch (error) {
//     //         console.error('Lỗi kiểm tra file:', error);
//     //         return false;
//     //     }
//     // }

//     // /**
//     //  * Lấy danh sách file PDF đã tải
//     //  */
//     // async getDownloadedPDFs(): Promise<string[]> {
//     //     try {
//     //         const dir = Platform.OS === 'android'
//     //             ? RNFetchBlob.fs.dirs.DownloadDir
//     //             : RNFetchBlob.fs.dirs.DocumentDir;

//     //         const files = await RNFetchBlob.fs.ls(dir);
//     //         return files.filter(file => file.endsWith('.pdf'));
//     //     } catch (error) {
//     //         console.error('Lỗi lấy danh sách file:', error);
//     //         return [];
//     //     }
//     // }

//     // /**
//     //  * Xóa file PDF đã tải
//     //  */
//     // async deletePDF(fileName: string): Promise<boolean> {
//     //     try {
//     //         const path = this.getDownloadPath(fileName);
//     //         await RNFetchBlob.fs.unlink(path);
//     //         return true;
//     //     } catch (error) {
//     //         console.error('Lỗi xóa file:', error);
//     //         return false;
//     //     }
//     // }

//     // /**
//     //  * Lấy thông tin file PDF
//     //  */
//     // async getPDFInfo(filePath: string): Promise<{ size: number; lastModified: Date } | null> {
//     //     try {
//     //         const stat = await RNFetchBlob.fs.stat(filePath);
//     //         return {
//     //             size: stat.size,
//     //             lastModified: new Date(stat.lastModified),
//     //         };
//     //     } catch (error) {
//     //         console.error('Lỗi lấy thông tin file:', error);
//     //         return null;
//     //     }
//     // }

//     // ==================== APP SHARE METHODS ====================

//     /**
//      * Chia sẻ link tải app
//      */
//     async shareAppDownload(
//         examName?: string,
//         examInfo?: any,
//         options: AppShareOptions = {}
//     ): Promise<void> {
//         try {
//             const defaultOptions = {
//                 appName: 'Ứng dụng Luyện Thi Pro',
//                 playStoreLink: 'https://play.google.com/store/apps/details?id=com.luyenthipro',
//                 appStoreLink: 'https://apps.apple.com/app/id1234567890',
//                 website: 'https://luyenthipro.com',
//             };

//             const config = { ...defaultOptions, ...options };

//             let message = `📱 ${config.appName}\n`;
//             message += `\n🎯 Ứng dụng luyện thi hàng đầu\n`;
//             message += `📚 Hàng ngàn đề thi chất lượng\n`;
//             message += `⏱ Thi thử có tính giờ\n`;
//             message += `📊 Theo dõi tiến độ học tập\n`;

//             // Thêm thông tin đề thi nếu có
//             if (examName) {
//                 message += `\n📌 Đang xem: ${examName}`;
//             }

//             if (examInfo?.duration) {
//                 message += `\n⏱ Thời gian: ${examInfo.duration} phút`;
//             }

//             if (examInfo?.numberQuestion) {
//                 message += `\n❓ Số câu: ${examInfo.numberQuestion}`;
//             }

//             // Thêm link download
//             message += `\n\n⬇️ TẢI ỨNG DỤNG NGAY:\n`;
//             message += `Android: ${config.playStoreLink}\n`;
//             message += `iOS: ${config.appStoreLink}\n`;
//             message += `Website: ${config.website}`;

//             // Thêm hashtag
//             message += `\n\n#LuyenThi #OnThi #HocTap #UngDungLuyenThi`;

//             await Share.open({
//                 title: `📱 ${config.appName}`,
//                 message: message,
//                 subject: `Ứng dụng Luyện Thi ${examName ? `- ${examName}` : ''}`,
//             });

//         } catch (error: any) {
//             if (error.message !== 'User did not share') {
//                 console.error('Lỗi chia sẻ app:', error);
//                 throw new Error('Không thể chia sẻ ứng dụng');
//             }
//         }
//     }

//     /**
//      * Chia sẻ deep link vào app (mở thẳng đến đề thi)
//      */
//     async shareDeepLink(
//         examId: string,
//         examName: string,
//         examInfo?: any,
//         options: AppShareOptions = {}
//     ): Promise<void> {
//         try {
//             const config = {
//                 deepLinkBase: 'luyenthipro://exam',
//                 appName: 'Luyện Thi Pro',
//                 playStoreLink: 'https://play.google.com/store/apps/details?id=com.luyenthipro',
//                 appStoreLink: 'https://apps.apple.com/app/id1234567890',
//                 ...options,
//             };

//             const deepLink = `${config.deepLinkBase}/${examId}`;

//             let message = `📱 ${config.appName}\n`;
//             message += `\n🔗 MỞ ĐỀ THI TRONG APP:\n${deepLink}`;

//             message += `\n\n📚 Đề thi: ${examName}`;

//             if (examInfo?.duration) {
//                 message += `\n⏱ Thời gian: ${examInfo.duration} phút`;
//             }

//             if (examInfo?.numberQuestion) {
//                 message += `\n❓ Số câu: ${examInfo.numberQuestion}`;
//             }

//             message += `\n\n⬇️ NẾU CHƯA CÓ APP, TẢI NGAY:\n`;
//             message += `Android: ${config.playStoreLink}\n`;
//             message += `iOS: ${config.appStoreLink}`;

//             message += `\n\n#LuyenThi #DeThi #${examName.replace(/\s+/g, '')}`;

//             await Share.open({
//                 title: `Mở đề thi: ${examName}`,
//                 message: message,
//                 url: deepLink,
//             });

//         } catch (error: any) {
//             if (error.message !== 'User did not share') {
//                 console.error('Lỗi chia sẻ deep link:', error);
//                 throw new Error('Không thể chia sẻ link');
//             }
//         }
//     }

//     /**
//      * Tạo mã QR code cho app (text representation)
//      */
//     generateAppQRText(options: AppShareOptions = {}): string {
//         const config = {
//             appName: 'Luyện Thi Pro',
//             playStoreLink: 'https://play.google.com/store/apps/details?id=com.luyenthipro',
//             appStoreLink: 'https://apps.apple.com/app/id1234567890',
//             website: 'https://luyenthipro.com',
//             ...options,
//         };

//         return `ỨNG DỤNG LUYỆN THI PRO\n\n` +
//             `📱 Tải app tại:\n` +
//             `Android: ${config.playStoreLink}\n` +
//             `iOS: ${config.appStoreLink}\n` +
//             `Web: ${config.website}\n\n` +
//             `Quét QR code để tải app nhanh chóng!`;
//     }

// }

// // Export singleton instance
// const pdfService = new PDFService();
// export default pdfService;
