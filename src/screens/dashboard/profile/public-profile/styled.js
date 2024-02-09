import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    backgroundColor: '#fff',
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 5,
  },
  drawerIcon: {
    width: RFValue(16),
    height: RFValue(16),
    marginTop: RFValue(6),
  },
  thumbnailSection: {
    alignItems: 'center',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(12),
    flexGrow: 1,
  },
  gradientButton: {
    borderRadius: 5,
    height: 32,
    textAlign: 'center',
    alignItems: 'center',
  },
  outlineButton: {
    borderRadius: 5,
    height: 32,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FB6200',
  },
  verifyIcon: {
    width: RFValue(15),
    height: RFValue(15),
    marginLeft: 3,
    marginTop: 10,
  },
});
