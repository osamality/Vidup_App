import {StyleSheet, Platform} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#ffff',
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
            height: 1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flex: 1
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    followersRequest: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    notificationSection: {
        marginTop: 20,
        flexGrow: 1
    },
    notificationItem: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row'
    },
    gradientButton: {
        borderRadius: 5,
        width: 80,
        height: 32,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 18
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection:'row',
        alignItems: 'center',
        flexGrow: 1,
    }
});