import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale, fontScale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: verticalScale(4),
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(30),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontWeight: '600',
    color: '#083070',
  },
  headerBadge: {
    position: 'relative',
  },
  headerBadgeDot: {
    position: 'absolute',
    top: verticalScale(-6),
    right: scale(-10),
    backgroundColor: '#F57921',
    borderRadius: scale(10),
    minWidth: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(4),
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: fontScale(10),
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#083070',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '47%',
    alignItems: 'center',
    marginBottom: verticalScale(25),
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: verticalScale(-5),
    right: scale(-10),
    backgroundColor: '#FF6B00',
    borderRadius: scale(10),
    minWidth: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(4),
  },
  badgeText: {
    color: '#fff',
    fontSize: fontScale(10),
    fontWeight: '600',
  },
  itemLabel: {
    fontSize: fontScale(12),
    color: '#000',
    marginTop: verticalScale(6),
    textAlign: 'center',
    fontWeight: '500',
  },
});
