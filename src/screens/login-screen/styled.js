import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';


export const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: '#fff',
    },
    container: {
        marginHorizontal: wp('10%'),
        height: '100%',
    },
    logoContainer: {
        marginTop: hp('10%'),
        alignItems: 'center'
    },
    logo: {
        width: 68.6,
        height: 55.1
    },
    signIntext: {
        fontSize: 16,
        color: Color.DarkGrey,
        marginTop: hp('5%'),
        fontFamily: FontFamily.medium,
        marginLeft: hp('1%')
    },
    loginButton: {
        height: hp("6%"),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    iconShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    whiteColor: {
        color: '#fff'
    },
    buttonMargin: {
        marginVertical: hp('1%'),
    },
    bottomText: {
        alignItems: 'center',
        flexDirection: 'column-reverse',
        marginBottom: hp('2%')
    },
    footerText: {
        fontFamily: 'Roboto-Regular',
        fontSize: RFValue(14),
        color: Color.DarkGrey
    }
});