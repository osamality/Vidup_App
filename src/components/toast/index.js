import { Toast } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const _toast = (type, message) => {
  Toast.show({
    type: type == 'danger' || type == 'success' || type == 'warning' ? '' : '',
    text: message,
    duration: 5000,
    position: 'bottom',
    style: {
      paddingBottom: 15,
      paddingTop: 15,
      margin: 15,
      position: 'absolute',
      bottom: hp('3%'),
      left: 0,
      right: 0,
      borderRadius: RFValue(5),
      backgroundColor: '#1C1C1C',
      elevation: 9,
    },
    textStyle: {
      textAlign: 'center',
      color: '#fff',
    },
  });
};
