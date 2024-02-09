import {StyleSheet} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    topBar: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: hp('2%'),
        // paddingTop: hp('2%'),
        marginBottom: 10,
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
    bodyText: { 
        marginLeft: 15, 
        fontSize: RFValue(14),
        fontFamily: FontFamily.regular,
        color: Color.DarkGrey
    },
    bodyIcon: { 
        width: RFValue(22), 
        height: RFValue(20) 
    }
});