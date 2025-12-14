import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    backgroundColor: '#001B5E',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },

  containTotalExam: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    gap: scale(10),
    paddingVertical: verticalScale(8),
    // borderWidth: 1,
    // borderColor: '#fff',
  },

  fileFullIcon: {
    width: 15,
    height: 20,
  },

  totalExam: {
    fontSize: 15,
    color: '#E5FF00',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },

  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: verticalScale(20),
  },

  columnWrapper: {
    justifyContent: 'space-between',
    // gap: 10,
  },

  listContent: {
    paddingTop: verticalScale(20),
  },

  emptyContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#f8f9fa',
    // borderRadius: 8,
    marginTop: verticalScale(10),
  },

  emptyText: {
    fontSize: 16,
    color: '#000',
  },
});
