import { StyleSheet } from 'react-native';
import { scale, moderateScale, verticalScale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16),
    borderRadius: 12,
    marginTop: verticalScale(40),
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    backgroundColor: '#EBF2FF',
    padding: scale(14),
  },
  title: {
    color: '#001C64',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  filterIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: '#1669EF',
  },

  containSubs: {
    marginHorizontal: scale(22),
  },

  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
    paddingVertical: scale(22),
  },
  item: {
    alignItems: 'center',
  },
  icon: {
    width: scale(28),
    height: scale(28),
    marginBottom: verticalScale(4),
  },
  text: {
    fontSize: moderateScale(11),
    color: '#001C64',
    fontWeight: '500',
  },
});
