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
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    logo: {
        resizeMode: 'stretch',
        width: wp("7%"),
        height: hp("2.5%")
    },
    logoText: {
        fontWeight: 'bold',
        fontSize: hp("2%")
    },
    textArea : {
        flexGrow: 1,
        width: wp('60%')
    }

});