import {StyleSheet, Platform} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';

export const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: "#fff",
        justifyContent: 'flex-start',
        flex: 1
    },

    container: {
        marginHorizontal: '5%',
        flex: 1
    },
    topBar: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: hp('2%'),
        // paddingTop: hp('2%'),
        // marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4.65,
        elevation: 6,
        zIndex: 9999,
    },
    thumbnailSection: {
        alignItems: 'center',
        alignSelf: 'center'
    },
    label: {
        fontSize: RFValue(12),
        fontWeight: 'normal',
        marginBottom: RFValue(8),
        marginTop: RFValue(18),
        color: Color.MediumGrey
    },
    input: {
        fontSize: RFValue(12),
        fontFamily: FontFamily.regular,
        color: Color.DarkGrey,
        borderWidth: 0.6,
        borderColor: Color.MediumGrey,
        borderRadius: RFValue(5),
        paddingVertical: RFValue(12),
        paddingHorizontal: RFValue(12)
    },
    loginButton: {
        alignItems: 'center',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp("6%")
    },
    outlineButton: {
        borderRadius: 5,
        textAlign: 'center',
        alignItems: 'center',
        height: hp("6%"),
        width: '100%',
        paddingTop: 4,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderColor: '#FB6200',
        
    },
    view: {
        justifyContent: 'flex-end',
        margin: 0
      }
});