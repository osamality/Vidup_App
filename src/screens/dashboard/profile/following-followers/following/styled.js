import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
export const styles = StyleSheet.create({
  UserListSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    paddingRight: 20,
    paddingLeft: 20,
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
    height: 32,
    minWidth: 90,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FB6200',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FB6200',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  verifyIcon: {
    width: RFValue(15),
    height: RFValue(15),
    marginLeft: 5,
    marginTop: 0,
  },
});
