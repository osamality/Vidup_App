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
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: hp('1%')
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
        fontSize: RFValue(14),
        fontFamily: FontFamily.regular,
        color: Color.DarkGrey,
        borderWidth: 0.6,
        borderColor: Color.MediumGrey,
        borderRadius: RFValue(5),
        paddingVertical: RFValue(12),
        paddingHorizontal: RFValue(12)
    }
});