import {StyleSheet} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
    topHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10
    },
    wrapper: {
        display: 'flex',
        flex: 1,
        backgroundColor: "#fff",
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
        minWidth: 90,
        textAlign: 'center',
        alignItems: 'center',
        height: 32,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20
    },
    outlineButton: {
        borderRadius: 5,
        minWidth: 90,
        textAlign: 'center',
        alignItems: 'center',
        height: 32,
        paddingTop: 4,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderColor: '#FB6200'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection:'row',
        alignItems: 'center',
        flexGrow: 1


    }
});