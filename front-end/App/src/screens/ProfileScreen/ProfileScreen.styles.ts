import { StyleSheet } from 'react-native';
import { scale, verticalScale, fontScale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#083070',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    backgroundColor: '#eee',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0C509E',
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: fontScale(18),
    fontWeight: '700',
    color: '#083070',
    marginTop: verticalScale(10),
  },
  email: {
    fontSize: fontScale(13),
    color: '#083070',
    marginTop: verticalScale(4),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.6,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: fontScale(14),
    color: '#000',
  },
  badge: {
    fontSize: fontScale(13),
    color: '#083070',
    fontWeight: '600',
  },
  // --- Dropdown + Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: '#d7e5fc42',
  },
  dropdownWrapper: {
    position: 'absolute',
    top: verticalScale(20),
    right: scale(20),
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    width: scale(150),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    gap:scale(12)
  },
  dropdownText: {
    fontSize: fontScale(14),
    color: '#000',
    fontWeight:500,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#f2f2f2',
  },
  customModal: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  width: '80%',
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingHorizontal: 40,
  paddingVertical: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
modalMessage: {
  fontSize: 16,
  fontWeight: '500',
  textAlign: 'center',
  marginBottom: 20,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
modalButton: {
  paddingVertical: 12,
  borderRadius: 10,
  marginHorizontal: 5,
  alignItems: 'center',
  width:'35%'
},
});
