import { StyleSheet } from 'react-native';
import { verticalScale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#0C4299',
    borderWidth: 1,
    elevation: 2, // Đổ bóng nếu cần
  },
  contentSearch: {
    paddingLeft: 2,
    paddingVertical: verticalScale(7),
    flex: 0.96,
    flexDirection: 'row',
    backgroundColor: '#F0F6FF',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#F0F6FF',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#F0F6FF',
  },
  searchButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
