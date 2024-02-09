import {StyleSheet} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    topHeader: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: hp('2%'),
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
        marginBottom: RFValue(25),
        display: 'flex',
        flexDirection: 'row'
    },
    gradientButton: {
        borderRadius: 5,
        height: 32,
        textAlign: 'center',
        alignItems: 'center',
    },
    outlineButton: {
        borderRadius: 5,
        height: 32,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#FB6200'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection:'row',
        alignItems: 'center',
        flexGrow: 1,
    }
});