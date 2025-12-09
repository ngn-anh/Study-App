import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F6',
  },

  content: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 10,
    marginVertical: 14,
  },

  infoExamContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  imageExam: {
    flex: 1,
    height: verticalScale(160),
  },
  nameExam: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  infoExam: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 66,
  },
  infoExamLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // itemIcon: {
  //   // width: 12,
  //   // height: 12,
  //   // color: '#000000',
  // },
  itemValue: {
    fontSize: 13,
    lineHeight: 16,
    color: '#000000',
  },
  infoExamRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  itemRight: {
    alignItems: 'center',
  },
  itemValueRight: {},
  itemDesRight: {},
  actionContainer: {},

  actionDownloadShare: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 5,
    paddingBottom: 12,
    paddingHorizontal: 13,
    borderColor: '#BCBCBC',
    borderTopWidth: 1,
  },
  nameExamPdf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pdfIcon: {
    height: 24,
    width: 24,
  },
  nameExamShort: {
    // 1. Bạn có thể dùng width cố định:
    // width: 180,

    // 2. Hoặc dùng maxWidth (để text “co lại” khi bố cục thay đổi):
    // maxWidth: 100,                // pixel, hoặc % của screen
    maxWidth: '50%',
    // Nếu component nằm trong một flex row, dùng:
    // flexShrink: 1,               // cho phép co lại

    // Các style thường:
    fontSize: 14,
    color: '#000000',
  },

  downloadShare: {
    flexDirection: 'row',
    gap: 20,
  },
  action: {
    width: 33,
    height: 33,
    backgroundColor: '#0C4299',
    borderRadius: 33 / 2,
    // padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionDisabled: {
    opacity: 0.5,
  },

  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  actionShare: {},

  // Tab Xem trước/Lịch sử thi
  tabContainer: {
    flexDirection: 'row',
    // marginTop: verticalScale(8),
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },

  tabItem: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },

  tabItemActive: {
    backgroundColor: '#0C4299',
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  tabContent: {
    // marginTop: verticalScale(12),
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(25),
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(14),
  },
  iconGroupLink: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: scale(14),
  },
  icon: {
    width: scale(14),
    height: scale(14),
    marginRight: scale(6),
    tintColor: '#6B7280',
  },
  iconLink: {
    width: scale(14),
    height: scale(14),
    marginRight: scale(6),
    tintColor: '#1669EF',
  },
  iconText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  linkText: {
    fontSize: moderateScale(12),
    color: '#1669EF',
    fontWeight: '600',
    marginRight: scale(8),
  },
  downloadShareIcon: {},
});
