import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  drawerIcon: {
    marginTop: RFValue(19),
  },
  thumbnailSection: {
    alignItems: 'center',
  },
  bodyIcon: {
    width: RFValue(18),
    height: RFValue(18),
  },
  verifyIcon: {
    width: RFValue(15),
    height: RFValue(15),
    marginLeft: 1,
    marginTop: 10,
  },
});
