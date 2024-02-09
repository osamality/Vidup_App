import { StyleSheet, Platform } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';

export const styles = StyleSheet.create({
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 37,
  },
  outlineButton: {
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    height: 37,
    width: '100%',
    paddingTop: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: '#FB6200'

  },
  view: {
    justifyContent: 'flex-end',
    margin: 0
  },
  thumbnail: {
    alignSelf: 'center',
    marginTop: 13
  },
});