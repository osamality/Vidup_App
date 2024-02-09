import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { RFValue } from "react-native-responsive-fontsize";

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
        marginTop: hp('5%'),
        marginBottom: hp("2%"),
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
    whiteColor: {
        color: '#fff',
    },
    buttonMargin: {
        marginBottom: hp('2%')
    },
    bottomText: {
        alignItems: 'center',
        flexDirection: 'column-reverse',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#D0D0D0',
        borderWidth: 1,
        marginTop: 7,
        borderRadius: 5,
        marginBottom: hp('5%'),
        paddingLeft: 20
    },
    socialButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        width: 100
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
    footerText: {
        fontFamily: FontFamily.regular,
        fontSize: RFValue(14),
        color: Color.DarkGrey
    }
});