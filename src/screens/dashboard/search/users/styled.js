import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
export const styles = StyleSheet.create({
  topHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  wrapper: {
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  followersRequest: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationSection: {
    flexGrow: 1,
  },
  notificationItem: {
    marginBottom: RFValue(25),
    display: 'flex',
    flexDirection: 'row',
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
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  verifyIcon: {
    width: RFValue(12),
    height: RFValue(12),
    marginLeft: 5,
    marginTop: 0,
  },
});
