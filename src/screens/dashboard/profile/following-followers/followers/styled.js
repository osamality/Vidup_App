import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
export const styles = StyleSheet.create({
  UserListSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  userInformation: {
    marginLeft: 10,
  },
  thumbnail: {
    marginTop: 0,
    width: 45,
    height: 45,
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: 8,
  },
  buttonOutline: {
    borderColor: '#FB6200',
  },
  buttonText: {
    color: '#FB6200',
  },
  gradientButton: {
    borderRadius: 5,
    minWidth: 90,
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: 32,
    alignItems: 'center',
  },
  verifyIcon: {
    width: RFValue(14),
    height: RFValue(14),
    marginLeft: 5,
    marginTop: 0,
  },
});
