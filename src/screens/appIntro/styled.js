import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
      },
      introImageStyle: {
        width: '50%',
        marginTop: RFValue(100),
        height: '50%',
        resizeMode: 'contain'
      },
      introTextStyle: {
        fontSize: RFValue(14),
        color: Color.LightGrey3,
        fontFamily: FontFamily.light,
        textAlign: 'center',
        marginVertical: RFValue(10),
        paddingHorizontal: RFValue(10)
      },
      introTitleStyle: {
        fontSize: RFValue(24),
        color: Color.DarkGrey,
        fontFamily: FontFamily.medium,
        textAlign: 'center',
        marginTop: RFValue(60),
      },
    });