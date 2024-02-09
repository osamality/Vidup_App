import { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#ffff'
    },
    topHeader: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4%'),
        paddingTop: hp('5%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    logo: {
        resizeMode: 'stretch',
        width: wp("7%"),
        height: hp("2.5%")
    },
    logoText: {
        fontWeight: 'bold',
        fontSize: hp("2%")
    }

});