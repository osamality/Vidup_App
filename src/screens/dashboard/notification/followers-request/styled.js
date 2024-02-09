import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: hp('2%'),
    marginBottom: hp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 9999,
  },
  wrapper: {
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flex: 1,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  followersRequest: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationSection: {
    flexGrow: 1,
    marginTop: RFValue(10),
  },
  notificationItem: {
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  gradientButton: {
    borderRadius: 5,
    width: 80,
    height: 32,
    paddingTop: 7,
    paddingBottom: 5,
    paddingLeft: 18,
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
});
